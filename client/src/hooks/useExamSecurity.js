/**
 * Enhanced Exam Security Hook
 * Comprehensive security management for secure examination
 * 
 * Features:
 * - Server-based timer synchronization
 * - Network resilience with local storage backup
 * - Auto-save answers
 * - Enhanced violation detection
 * - Real-time heartbeat monitoring
 * - Fullscreen management
 * - Tab/window switch detection
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    sendHeartbeat,
    reportViolation,
    submitExamAttempt
} from '../lib/api/examApi';
import {
    EXAM_SECURITY_CONFIG,
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    onFullscreenChange,
    onVisibilityChange,
    onWindowFocusChange,
    onNetworkChange,
    checkNetworkStatus,
    getNetworkQuality,
    blockKeyboardShortcuts,
    blockCopy,
    blockPaste,
    blockCut,
    blockContextMenu,
    blockTextSelection,
    createViolationLog,
    backupViolation,
    backupAnswers,
    loadAnswersBackup,
    backupTimerState,
    loadTimerState,
    createAnswerAutoSaver,
    disableBackButton,
    preventPageUnload,
    formatTime,
    formatTimeOutside,
    getWarningMessage,
    shouldDisqualify
} from '../utils/examSecurity';

// ================= CONFIG =================

const DEFAULT_CONFIG = {
    HEARTBEAT_INTERVAL: 30000, // 30 seconds
    HEARTBEAT_TIMEOUT: 60000, // 1 minute
    ANSWER_SAVE_INTERVAL: 10000, // 10 seconds
    MAX_TIME_OUTSIDE: 5 * 60 * 1000, // 5 minutes
    WARNING_THRESHOLDS: [1, 3, 5],
    AUTO_SUBMIT_VIOLATIONS: 5
};

// ================= MAIN HOOK =================

const useExamSecurity = (examId, attemptId, options = {}) => {
    const config = { ...DEFAULT_CONFIG, ...options };
    
    // ================= STATE =================
    
    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [formattedTime, setFormattedTime] = useState("00:00:00");
    const [isTimeUp, setIsTimeUp] = useState(false);
    
    // Violations
    const [violations, setViolations] = useState([]);
    const [violationCount, setViolationCount] = useState(0);
    const [warningMessage, setWarningMessage] = useState(null);
    
    // Time tracking
    const [timeOutside, setTimeOutside] = useState(0);
    const [formattedTimeOutside, setFormattedTimeOutside] = useState("00:00");
    const [isOutside, setIsOutside] = useState(false);
    
    // Status
    const [examStatus, setExamStatus] = useState("NOT_STARTED");
    const [isDisqualified, setIsDisqualified] = useState(false);
    const [disqualificationReason, setDisqualificationReason] = useState("");
    
    // Fullscreen
    const [isFullscreenMode, setIsFullscreenMode] = useState(false);
    
    // Heartbeat
    const [lastHeartbeat, setLastHeartbeat] = useState(null);
    const [heartbeatMissed, setHeartbeatMissed] = useState(0);
    
    // Network
    const [isOnline, setIsOnline] = useState(true);
    const [networkQuality, setNetworkQuality] = useState({ label: 'UNKNOWN', color: 'gray' });
    
    // Answers
    const [answers, setAnswers] = useState({});
    
    // Loading
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Refs for timers and tracking
    const heartbeatIntervalRef = useRef(null);
    const answerSaveIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const outsideTimerRef = useRef(null);
    const lastOutsideTimeRef = useRef(null);
    const isTabActiveRef = useRef(true);
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);
    const answersRef = useRef({});
    const cleanupRef = useRef(null);

    // ================= ANSWER MANAGEMENT =================

    const updateAnswer = useCallback((questionId, answer) => {
        answersRef.current[questionId] = answer;
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    }, []);

    const getAnswers = useCallback(() => {
        return Object.entries(answersRef.current).map(([questionId, answer]) => ({
            questionId,
            ...answer
        }));
    }, []);

    // Load backed up answers on mount
    useEffect(() => {
        if (attemptId) {
            const backup = loadAnswersBackup();
            if (backup && backup.attemptId === attemptId) {
                answersRef.current = backup.answers || {};
                setAnswers(backup.answers || {});
            }
        }
    }, [attemptId]);

    // ================= TIMER UTILITIES =================

    const formatTimeDisplay = useCallback((ms) => {
        if (ms < 0) ms = 0;
        const totalSeconds = Math.floor(ms / 1000);
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // ================= HEARTBEAT SYSTEM =================

    const sendHeartbeatToServer = useCallback(async () => {
        if (!attemptId) return { error: "No attempt ID" };

        try {
            const response = await sendHeartbeat(attemptId, {
                timeOutside,
                status: isOutside ? "outside" : "active"
            });

            if (response.disqualified) {
                handleDisqualification(response.message || "Disqualified for violations");
                return { disqualified: true };
            }

            if (response.expired || response.timerExpired) {
                handleTimeExpiry();
                return { expired: true };
            }

            // Update timer from server response
            if (response.remainingTime !== undefined) {
                const remainingMs = response.remainingTime;
                setTimeRemaining(remainingMs);
                setFormattedTime(formatTimeDisplay(remainingMs));
                setIsTimeUp(remainingMs <= 0);
            }

            // Update heartbeat timestamp
            if (response.serverTime) {
                setLastHeartbeat(new Date(response.serverTime));
            } else {
                setLastHeartbeat(new Date());
            }
            
            setHeartbeatMissed(0);
            
            return { success: true };
        } catch (error) {
            console.error("Heartbeat error:", error);
            setHeartbeatMissed(prev => prev + 1);
            
            // Check for heartbeat timeout
            if (heartbeatMissed >= 2) {
                // Continue with local timer, but flag network issue
                setIsOnline(false);
            }
            
            return { error: error.message };
        }
    }, [attemptId, timeOutside, isOutside, heartbeatMissed, formatTimeDisplay]);

    // ================= VIOLATION HANDLING =================

    const handleViolation = useCallback(async (type, details = "", duration = 0) => {
        const violation = createViolationLog(type, details, {
            duration,
            timeRemaining
        });
        
        // Add to local state
        setViolations(prev => [...prev, violation]);
        
        // Increment count
        const newCount = violationCount + 1;
        setViolationCount(newCount);
        
        // Update warning message
        const warning = getWarningMessage(newCount);
        if (warning) {
            setWarningMessage(warning);
        }
        
        // Backup violation
        backupViolation(violation);
        
        // Report to server
        try {
            await reportViolation(attemptId, {
                type,
                details,
                duration
            });
        } catch (error) {
            console.error("Report violation error:", error);
        }
        
        // Check for disqualification
        if (shouldDisqualify(timeOutside)) {
            handleDisqualification("Exceeded maximum time outside exam window");
        }
        
        return violation;
    }, [attemptId, violationCount, timeOutside]);

    // ================= EVENT HANDLERS =================

    const handleVisibilityChange = useCallback((visibilityState) => {
        if (examStatus !== "IN_PROGRESS") return;
        
        const isVisible = visibilityState === 'visible';
        
        if (!isVisible) {
            // Student switched tabs or minimized
            setIsOutside(true);
            isTabActiveRef.current = false;
            lastOutsideTimeRef.current = Date.now();
            
            handleViolation("TAB_SWITCH", "Tab switch detected");
        } else {
            // Student returned to tab
            const timeSpent = Date.now() - lastOutsideTimeRef.current;
            setTimeOutside(prev => prev + timeSpent);
            setIsOutside(false);
            isTabActiveRef.current = true;
        }
    }, [examStatus, handleViolation]);

    const handleWindowBlur = useCallback(() => {
        if (examStatus !== "IN_PROGRESS") return;
        
        setIsOutside(true);
        isTabActiveRef.current = false;
        lastOutsideTimeRef.current = Date.now();
        
        handleViolation("WINDOW_BLUR", "Window lost focus");
    }, [examStatus, handleViolation]);

    const handleWindowFocus = useCallback(() => {
        if (isOutside && examStatus === "IN_PROGRESS") {
            const timeSpent = Date.now() - lastOutsideTimeRef.current;
            setTimeOutside(prev => prev + timeSpent);
            setIsOutside(false);
            isTabActiveRef.current = true;
        }
    }, [examStatus, isOutside]);

    const handleFullscreenChange = useCallback((fullscreen) => {
        setIsFullscreenMode(fullscreen);
        
        if (!fullscreen && examStatus === "IN_PROGRESS") {
            handleViolation("FULLSCREEN_EXIT", "Exited fullscreen mode");
        }
    }, [examStatus, handleViolation]);

    const handleKeyboard = useCallback((e) => {
        if (examStatus !== "IN_PROGRESS") return;
        
        const result = blockKeyboardShortcuts(e);
        if (result.blocked) {
            handleViolation(result.type, result.key);
        }
    }, [examStatus, handleViolation]);

    const handleCopy = useCallback((e) => {
        if (examStatus === "IN_PROGRESS") {
            e.preventDefault();
            handleViolation("COPY_ATTEMPT", "Copy attempt blocked");
        }
    }, [examStatus, handleViolation]);

    const handlePaste = useCallback((e) => {
        if (examStatus === "IN_PROGRESS") {
            e.preventDefault();
            handleViolation("PASTE_ATTEMPT", "Paste attempt blocked");
        }
    }, [examStatus, handleViolation]);

    const handleContextMenu = useCallback((e) => {
        if (examStatus === "IN_PROGRESS") {
            e.preventDefault();
            handleViolation("RIGHT_CLICK", "Right click blocked");
        }
    }, [examStatus, handleViolation]);

    const handleSelection = useCallback((e) => {
        if (examStatus === "IN_PROGRESS") {
            blockTextSelection(e);
        }
    }, [examStatus]);

    const handleNetworkChange = useCallback((status) => {
        setIsOnline(status.online);
        
        const quality = getNetworkQuality();
        setNetworkQuality(quality);
        
        if (!status.online) {
            handleViolation("NETWORK_OFFLINE", "Network connection lost");
        } else if (status.online && !isOnline) {
            // Network restored
            handleViolation("NETWORK_RESTORED", "Network connection restored");
        }
    }, [isOnline, handleViolation]);

    // ================= DISQUALIFICATION =================

    const handleDisqualification = useCallback((reason) => {
        setIsDisqualified(true);
        setDisqualificationReason(reason);
        setExamStatus("DISQUALIFIED");
        
        cleanup();
    }, []);

    const handleTimeExpiry = useCallback(() => {
        setIsTimeUp(true);
        setExamStatus("AUTO_SUBMITTED");
        setTimeRemaining(0);
        setFormattedTime("00:00:00");
        
        cleanup();
    }, []);

    // ================= CLEANUP =================

    const cleanup = useCallback(() => {
        // Clear intervals
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
        
        if (answerSaveIntervalRef.current) {
            clearInterval(answerSaveIntervalRef.current);
            answerSaveIntervalRef.current = null;
        }
        
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        
        // Remove event listeners
        if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
        }
        
        // Exit fullscreen
        if (isFullscreen()) {
            exitFullscreen();
        }
        
        // Remove navigation blocks
        window.removeEventListener('beforeunload', preventPageUnload);
    }, []);

    // ================= INITIALIZATION =================

    const initSecurity = useCallback(() => {
        // Add event listeners
        const cleanupVisibility = onVisibilityChange(handleVisibilityChange);
        const cleanupFocus = onWindowFocusChange(
            handleWindowFocus,
            handleWindowBlur
        );
        const cleanupFullscreen = onFullscreenChange(handleFullscreenChange);
        const cleanupNetwork = onNetworkChange(handleNetworkChange);
        
        document.addEventListener('keydown', handleKeyboard);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('selectstart', handleSelection);
        
        // Prevent page unload
        window.addEventListener('beforeunload', preventPageUnload);
        
        // Disable back button
        const cleanupBackButton = disableBackButton();
        
        // Store cleanup function
        cleanupRef.current = () => {
            cleanupVisibility();
            cleanupFocus();
            cleanupFullscreen();
            cleanupNetwork();
            cleanupBackButton();
            document.removeEventListener('keydown', handleKeyboard);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('selectstart', handleSelection);
            window.removeEventListener('beforeunload', preventPageUnload);
        };
    }, [
        handleVisibilityChange,
        handleWindowFocus,
        handleWindowBlur,
        handleFullscreenChange,
        handleNetworkChange,
        handleKeyboard,
        handleCopy,
        handlePaste,
        handleContextMenu,
        handleSelection
    ]);

    // ================= PUBLIC METHODS =================

    const startExam = useCallback(async (serverTimerData = null) => {
        setLoading(true);
        
        try {
            // Enter fullscreen
            await enterFullscreen();
            
            // Initialize security
            initSecurity();
            
            // Set timer from server data or restore from backup
            if (serverTimerData) {
                startTimeRef.current = new Date(serverTimerData.startTime);
                endTimeRef.current = new Date(serverTimerData.endTime);
                
                // Calculate initial remaining time
                const now = Date.now();
                const remaining = endTimeRef.current - now;
                setTimeRemaining(remaining);
                setFormattedTime(formatTimeDisplay(remaining));
                setIsTimeUp(remaining <= 0);
                
                // Backup timer state
                backupTimerState({
                    startTime: serverTimerData.startTime,
                    endTime: serverTimerData.endTime,
                    duration: serverTimerData.duration
                });
            } else {
                // Try to restore from backup
                const timerState = loadTimerState();
                if (timerState) {
                    const elapsed = Date.now() - timerState.timestamp;
                    const remaining = new Date(timerState.endTime) - Date.now();
                    
                    startTimeRef.current = new Date(timerState.startTime);
                    endTimeRef.current = new Date(timerState.endTime);
                    
                    setTimeRemaining(Math.max(0, remaining));
                    setFormattedTime(formatTimeDisplay(Math.max(0, remaining)));
                }
            }
            
            // Start local timer for smooth countdown
            timerIntervalRef.current = setInterval(() => {
                if (endTimeRef.current) {
                    const now = Date.now();
                    const remaining = endTimeRef.current - now;
                    
                    setTimeRemaining(Math.max(0, remaining));
                    setFormattedTime(formatTimeDisplay(Math.max(0, remaining)));
                    setIsTimeUp(remaining <= 0);
                    
                    // Check for expiry
                    if (remaining <= 0 && examStatus === "IN_PROGRESS") {
                        handleTimeExpiry();
                    }
                }
            }, 1000);
            
            // Start heartbeat
            heartbeatIntervalRef.current = setInterval(() => {
                sendHeartbeatToServer();
            }, config.HEARTBEAT_INTERVAL);
            
            // Start answer auto-save
            const autoSaver = createAnswerAutoSaver(
                getAnswers,
                attemptId,
                config.ANSWER_SAVE_INTERVAL
            );
            autoSaver.start();
            answerSaveIntervalRef.current = autoSaver;
            
            setExamStatus("IN_PROGRESS");
            
            return { success: true };
        } catch (error) {
            console.error("Start exam error:", error);
            return { error: error.message };
        } finally {
            setLoading(false);
        }
    }, [config, examStatus, formatTimeDisplay, getAnswers, attemptId, initSecurity, sendHeartbeatToServer]);

    const submitExam = useCallback(async () => {
        if (!attemptId) return { error: "No active attempt" };
        
        setSubmitting(true);
        try {
            const examAnswers = getAnswers();
            
            const response = await submitExamAttempt(attemptId, examAnswers);
            
            if (response.success) {
                cleanup();
                setExamStatus("SUBMITTED");
                
                // Clear answer backup
                if (answerSaveIntervalRef.current) {
                    answerSaveIntervalRef.current.clear();
                }
            }
            
            return response;
        } catch (error) {
            console.error("Submit exam error:", error);
            return { error: error.message };
        } finally {
            setSubmitting(false);
        }
    }, [attemptId, getAnswers, cleanup]);

    const forceSubmit = useCallback(async () => {
        cleanup();
        setExamStatus("AUTO_SUBMITTED");
        
        // Try to submit with current answers
        try {
            await submitExam();
        } catch (error) {
            console.error("Force submit error:", error);
        }
    }, [submitExam, cleanup]);

    const setServerTimer = useCallback((startTime, endTime) => {
        startTimeRef.current = new Date(startTime);
        endTimeRef.current = new Date(endTime);
        
        // Backup timer state
        backupTimerState({
            startTime,
            endTime,
            duration: (new Date(endTime) - new Date(startTime)) / 1000
        });
    }, []);

    // ================= TIME OUTSIDE TRACKING =================

    useEffect(() => {
        if (isOutside && examStatus === "IN_PROGRESS") {
            // Update time outside every second while outside
            outsideTimerRef.current = setInterval(() => {
                setTimeOutside(prev => {
                    const newTime = prev + 1000;
                    
                    // Check disqualification
                    if (newTime > config.MAX_TIME_OUTSIDE) {
                        handleDisqualification("Exceeded maximum time outside exam window");
                    }
                    
                    return newTime;
                });
            }, 1000);
        }
        
        return () => {
            if (outsideTimerRef.current) {
                clearInterval(outsideTimerRef.current);
            }
        };
    }, [isOutside, examStatus, config.MAX_TIME_OUTSIDE, handleDisqualification]);

    useEffect(() => {
        setFormattedTimeOutside(formatTimeOutside(timeOutside));
    }, [timeOutside]);

    // ================= EFFECT: CLEANUP ON UNMOUNT =================

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    // ================= RETURN =================

    return {
        // Timer
        timeRemaining,
        formattedTime,
        isTimeUp,
        setServerTimer,
        
        // Violations
        violations,
        violationCount,
        warningMessage,
        handleViolation,
        
        // Time tracking
        timeOutside,
        formattedTimeOutside,
        isOutside,
        
        // Status
        examStatus,
        isDisqualified,
        disqualificationReason,
        
        // Fullscreen
        isFullscreenMode,
        
        // Heartbeat
        lastHeartbeat,
        heartbeatMissed,
        
        // Network
        isOnline,
        networkQuality,
        
        // Answers
        answers,
        updateAnswer,
        getAnswers,
        
        // Loading
        loading,
        submitting,
        
        // Methods
        startExam,
        submitExam,
        forceSubmit,
        cleanup,
        
        // Config
        config: { ...config, ...EXAM_SECURITY_CONFIG }
    };
};

export default useExamSecurity;

