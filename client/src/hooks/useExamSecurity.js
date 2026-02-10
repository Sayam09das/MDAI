import { useState, useEffect, useCallback, useRef } from 'react';
import {
    startExam,
    submitExam,
    sendHeartbeat,
    reportViolation,
    getExamStatus
} from '../lib/api/examApi';
import {
    EXAM_SECURITY_CONFIG,
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    applySecurityRestrictions,
    removeSecurityRestrictions,
    formatTime,
    formatTimeOutside,
    getWarningMessage,
    shouldDisqualify,
    getRemainingSafeTime,
    createViolationLog,
    backupViolation,
    getBackedUpViolations,
    clearBackedUpViolations,
    isPageVisible,
    hasWindowFocus
} from '../utils/examSecurity';

/**
 * Custom hook for managing secure exam session
 */
const useExamSecurity = (assignmentId, examId) => {
    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isTimeUp, setIsTimeUp] = useState(false);
    
    // Violation tracking
    const [violations, setViolations] = useState([]);
    const [violationCount, setViolationCount] = useState(0);
    const [warningMessage, setWarningMessage] = useState(null);
    
    // Time outside tracking
    const [timeOutside, setTimeOutside] = useState(0);
    const [isOutside, setIsOutside] = useState(false);
    const outsideIntervalRef = useRef(null);
    
    // Heartbeat
    const [heartbeatInterval, setHeartbeatInterval] = useState(null);
    const [lastHeartbeat, setLastHeartbeat] = useState(null);
    
    // Fullscreen
    const [isFullscreenMode, setIsFullscreenMode] = useState(false);
    
    // Exam status
    const [examStatus, setExamStatus] = useState('NOT_STARTED');
    const [isDisqualified, setIsDisqualified] = useState(false);
    const [disqualificationReason, setDisqualificationReason] = useState('');
    
    // Loading states
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Answers
    const [answers, setAnswers] = useState({});
    
    // Refs for tracking
    const outsideStartTimeRef = useRef(null);
    const heartbeatTimeoutRef = useRef(null);
    const timerIntervalRef = useRef(null);
    
    /**
     * Initialize security measures
     */
    const initializeSecurity = useCallback(async () => {
        // Apply all security restrictions
        applySecurityRestrictions();
        
        // Enter fullscreen mode
        const entered = await enterFullscreen(document.documentElement);
        setIsFullscreenMode(entered);
        
        // Start tracking time outside
        startTimeOutsideTracking();
        
        // Start heartbeat
        startHeartbeat();
        
        // Restore backed up violations
        const backedUp = getBackedUpViolations();
        if (backedUp.length > 0) {
            setViolations(backedUp);
            setViolationCount(backedUp.length);
        }
    }, []);
    
    /**
     * Cleanup security measures
     */
    const cleanupSecurity = useCallback(() => {
        removeSecurityRestrictions();
        exitFullscreen();
        stopTimeOutsideTracking();
        stopHeartbeat();
        clearInterval(timerIntervalRef.current);
    }, []);
    
    /**
     * Start tracking time outside exam tab
     */
    const startTimeOutsideTracking = useCallback(() => {
        outsideIntervalRef.current = setInterval(() => {
            if (isOutside) {
                setTimeOutside(prev => {
                    const newTime = prev + 1000;
                    setViolations(prevViolations => {
                        // Log time outside periodically
                        if (newTime % 30000 < 1000) { // Every 30 seconds
                            const log = createViolationLog('TIME_OUTSIDE_EXCEEDED', `Outside for ${formatTimeOutside(newTime)}`);
                            backupViolation(log);
                        }
                        return prevViolations;
                    });
                    
                    // Check if should disqualify
                    if (shouldDisqualify(newTime)) {
                        handleDisqualification('Exceeded 5 minutes outside exam window');
                    }
                    
                    return newTime;
                });
            }
        }, 1000);
    }, [isOutside]);
    
    /**
     * Stop tracking time outside
     */
    const stopTimeOutsideTracking = useCallback(() => {
        if (outsideIntervalRef.current) {
            clearInterval(outsideIntervalRef.current);
            outsideIntervalRef.current = null;
        }
    }, []);
    
    /**
     * Start heartbeat to server
     */
    const startHeartbeat = useCallback(() => {
        const interval = setInterval(async () => {
            if (examId && examStatus === 'IN_PROGRESS' && !isDisqualified) {
                try {
                    const response = await sendHeartbeat(
                        examId,
                        'active',
                        timeOutside,
                        isPageVisible() ? 'visible' : 'hidden'
                    );
                    
                    if (response.disqualified) {
                        handleDisqualification(response.reason);
                    }
                    
                    if (response.expired) {
                        setIsTimeUp(true);
                        await autoSubmit();
                    }
                    
                    setLastHeartbeat(new Date());
                    setViolationCount(response.violations || violationCount);
                } catch (error) {
                    console.error('Heartbeat failed:', error);
                    // Handle heartbeat timeout
                    handleHeartbeatTimeout();
                }
            }
        }, EXAM_SECURITY_CONFIG.HEARTBEAT_INTERVAL);
        
        setHeartbeatInterval(interval);
    }, [examId, examStatus, isDisqualified, timeOutside, violationCount]);
    
    /**
     * Stop heartbeat
     */
    const stopHeartbeat = useCallback(() => {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            setHeartbeatInterval(null);
        }
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
        }
    }, [heartbeatInterval]);
    
    /**
     * Handle heartbeat timeout
     */
    const handleHeartbeatTimeout = useCallback(async () => {
        const log = createViolationLog('HEARTBEAT_MISSED', 'Server did not respond to heartbeat');
        addViolation(log.type, log.details);
        
        // If multiple timeouts, auto-submit
        const timeouts = violations.filter(v => v.type === 'HEARTBEAT_MISSED').length;
        if (timeouts >= 3) {
            await autoSubmit();
        }
    }, [violations]);
    
    /**
     * Add a violation
     */
    const addViolation = useCallback(async (type, details = '') => {
        const log = createViolationLog(type, details);
        
        // Update local state
        setViolations(prev => [...prev, log]);
        setViolationCount(prev => {
            const newCount = prev + 1;
            
            // Check warning thresholds
            if (EXAM_SECURITY_CONFIG.WARNING_THRESHOLDS.includes(newCount)) {
                setWarningMessage(getWarningMessage(newCount));
            }
            
            // Send to server
            if (examId) {
                reportViolation(examId, type, details, Date.now() - (outsideStartTimeRef.current || Date.now()))
                    .catch(console.error);
            }
            
            // Backup violation
            backupViolation(log);
            
            return newCount;
        });
        
        // Clear warning after 5 seconds
        setTimeout(() => setWarningMessage(null), 5000);
    }, [examId]);
    
    /**
     * Handle tab/window switch
     */
    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            setIsOutside(true);
            outsideStartTimeRef.current = Date.now();
            addViolation('TAB_SWITCH', 'Student switched to another tab/window');
        } else {
            setIsOutside(false);
            if (outsideStartTimeRef.current) {
                const duration = Date.now() - outsideStartTimeRef.current;
                outsideStartTimeRef.current = null;
                addViolation('WINDOW_BLUR', `Was outside for ${formatTimeOutside(duration)}`, duration);
            }
        }
    }, [addViolation]);
    
    /**
     * Handle window blur
     */
    const handleWindowBlur = useCallback(() => {
        if (examStatus === 'IN_PROGRESS' && !isDisqualified) {
            addViolation('WINDOW_BLUR', 'Window lost focus');
        }
    }, [examStatus, isDisqualified, addViolation]);
    
    /**
     * Handle fullscreen change
     */
    const handleFullscreenChange = useCallback(() => {
        if (!isFullscreen()) {
            addViolation('FULLSCREEN_EXIT', 'Student exited fullscreen mode');
            // Try to re-enter fullscreen
            setTimeout(async () => {
                await enterFullscreen(document.documentElement);
            }, 1000);
        }
        setIsFullscreenMode(isFullscreen());
    }, [addViolation]);
    
    /**
     * Handle keyboard shortcuts
     */
    const handleKeyDown = useCallback((e) => {
        if (examStatus !== 'IN_PROGRESS' || isDisqualified) return;
        
        // Block specific shortcuts
        if (e.ctrlKey || e.metaKey) {
            if (['c', 'v', 'x', 'u', 's', 'p', 'a', 'f'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                addViolation('KEYBOARD_SHORTCUT', `Ctrl/Cmd + ${e.key}`);
            }
        }
        
        // Block F12
        if (e.key === 'F12') {
            e.preventDefault();
            addViolation('DEV_TOOLS_OPEN', 'Developer tools shortcut pressed');
        }
    }, [examStatus, isDisqualified, addViolation]);
    
    /**
     * Handle context menu (right-click)
     */
    const handleContextMenu = useCallback((e) => {
        e.preventDefault();
        addViolation('RIGHT_CLICK', 'Right-click attempt detected');
        return false;
    }, [addViolation]);
    
    /**
     * Handle copy attempt
     */
    const handleCopy = useCallback((e) => {
        e.preventDefault();
        addViolation('COPY_ATTEMPT', 'Copy attempt detected');
        return false;
    }, [addViolation]);
    
    /**
     * Handle paste attempt
     */
    const handlePaste = useCallback((e) => {
        e.preventDefault();
        addViolation('PASTE_ATTEMPT', 'Paste attempt detected');
        return false;
    }, [addViolation]);
    
    /**
     * Handle page unload
     */
    const handleBeforeUnload = useCallback((e) => {
        e.preventDefault();
        e.returnValue = '';
        
        // Still add violation
        addViolation('PAGE_REFRESH', 'Student attempted to refresh or close page');
        
        return '';
    }, [addViolation]);
    
    /**
     * Handle disqualification
     */
    const handleDisqualification = useCallback(async (reason) => {
        setIsDisqualified(true);
        setDisqualificationReason(reason);
        setExamStatus('DISQUALIFIED');
        
        // Stop all tracking
        stopTimeOutsideTracking();
        stopHeartbeat();
        
        // Auto-submit
        await autoSubmit();
    }, [stopTimeOutsideTracking, stopHeartbeat]);
    
    /**
     * Auto-submit exam
     */
    const autoSubmit = useCallback(async () => {
        if (submitting || examStatus !== 'IN_PROGRESS') return;
        
        setSubmitting(true);
        
        try {
            if (examId) {
                await submitExam(examId, answers, null);
            }
            setExamStatus('AUTO_SUBMITTED');
        } catch (error) {
            console.error('Auto-submit failed:', error);
        } finally {
            setSubmitting(false);
            cleanupSecurity();
        }
    }, [examId, answers, examStatus, submitting, cleanupSecurity]);
    
    /**
     * Start the exam
     */
    const startExamSession = useCallback(async (duration = 60) => {
        setLoading(true);
        
        try {
            const response = await startExam(assignmentId, duration);
            
            if (response.success) {
                setExamStatus('IN_PROGRESS');
                setTimeRemaining(response.examSession.endTime - new Date());
                
                // Initialize security
                initializeSecurity();
            }
            
            return response;
        } catch (error) {
            console.error('Failed to start exam:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [assignmentId, initializeSecurity]);
    
    /**
     * Submit the exam
     */
    const submitExamSession = useCallback(async () => {
        if (submitting) return;
        
        setSubmitting(true);
        
        try {
            const response = await submitExam(examId, answers, null);
            
            if (response.success) {
                setExamStatus('SUBMITTED');
                cleanupSecurity();
            }
            
            return response;
        } catch (error) {
            console.error('Failed to submit exam:', error);
            throw error;
        } finally {
            setSubmitting(false);
        }
    }, [examId, answers, submitting, cleanupSecurity]);
    
    /**
     * Update answer
     */
    const updateAnswer = useCallback((questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    }, []);
    
    /**
     * Set up event listeners
     */
    useEffect(() => {
        if (examStatus === 'IN_PROGRESS' && !isDisqualified) {
            // Visibility change
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            // Window events
            window.addEventListener('blur', handleWindowBlur);
            window.addEventListener('focus', handleWindowBlur);
            window.addEventListener('fullscreenchange', handleFullscreenChange);
            
            // Keyboard
            document.addEventListener('keydown', handleKeyDown);
            
            // Context menu
            document.addEventListener('contextmenu', handleContextMenu);
            
            // Copy/Paste
            document.addEventListener('copy', handleCopy);
            document.addEventListener('paste', handlePaste);
            
            // Page unload
            window.addEventListener('beforeunload', handleBeforeUnload);
            
            // Timer
            timerIntervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = prev - 1000;
                    if (newTime <= 0) {
                        setIsTimeUp(true);
                        autoSubmit();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }
        
        return () => {
            // Clean up all event listeners
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowBlur);
            window.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            
            clearInterval(timerIntervalRef.current);
        };
    }, [examStatus, isDisqualified, handleVisibilityChange, handleWindowBlur, 
        handleFullscreenChange, handleKeyDown, handleContextMenu, 
        handleCopy, handlePaste, handleBeforeUnload, autoSubmit]);
    
    /**
     * Fetch exam status on mount
     */
    useEffect(() => {
        if (examId) {
            const fetchStatus = async () => {
                try {
                    const response = await getExamStatus(examId);
                    if (response.success) {
                        setExamStatus(response.examSession.status);
                        setViolations(response.examSession.violations || []);
                        setViolationCount(response.examSession.totalViolations || 0);
                        setTimeRemaining(response.examSession.remainingTime || 0);
                        
                        if (['DISQUALIFIED', 'SUBMITTED', 'AUTO_SUBMITTED'].includes(response.examSession.status)) {
                            setIsDisqualified(response.examSession.status === 'DISQUALIFIED');
                            setDisqualificationReason(response.examSession.disqualifiedReason || '');
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch exam status:', error);
                }
            };
            
            fetchStatus();
        }
    }, [examId]);
    
    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            cleanupSecurity();
        };
    }, [cleanupSecurity]);
    
    return {
        // Timer
        timeRemaining,
        formattedTime: formatTime(timeRemaining),
        isTimeUp,
        
        // Violations
        violations,
        violationCount,
        warningMessage,
        
        // Time outside
        timeOutside,
        formattedTimeOutside: formatTimeOutside(timeOutside),
        isOutside,
        maxTimeOutside: EXAM_SECURITY_CONFIG.MAX_TIME_OUTSIDE,
        remainingSafeTime: getRemainingSafeTime(timeOutside),
        
        // Status
        examStatus,
        isDisqualified,
        disqualificationReason,
        
        // Fullscreen
        isFullscreenMode,
        
        // Heartbeat
        lastHeartbeat,
        
        // Actions
        startExamSession,
        submitExamSession,
        updateAnswer,
        addViolation,
        
        // Loading
        loading,
        submitting,
        
        // Cleanup
        cleanupSecurity,
        
        // Constants
        config: EXAM_SECURITY_CONFIG
    };
};

export default useExamSecurity;

