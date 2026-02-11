/**
 * Enhanced Exam Security Utilities
 * Comprehensive security functions for secure examination system
 * 
 * Features:
 * - Fullscreen management
 * - Keyboard blocking
 * - Clipboard protection
 * - Network status monitoring
 * - Answer backup to localStorage
 * - Violation logging
 * - Developer tools detection
 */

// ================= CONFIG =================

export const EXAM_SECURITY_CONFIG = {
    // Timing
    HEARTBEAT_INTERVAL: 30000, // 30 seconds
    HEARTBEAT_TIMEOUT: 120000, // 2 minutes
    MAX_TIME_OUTSIDE: 300000, // 5 minutes (300 seconds)
    ANSWER_SAVE_INTERVAL: 10000, // 10 seconds
    
    // Violations
    MAX_VIOLATIONS: 5,
    WARNING_THRESHOLDS: [1, 3],
    WARNING_MESSAGES: [
        "⚠️ First Warning: Do not leave the exam window!",
        "⚠️ Second Warning: Multiple violations recorded!",
        "🚫 Final Warning: One more violation and you'll be disqualified!"
    ],
    
    // LocalStorage Keys
    STORAGE_KEYS: {
        ANSWERS: 'exam_answers_backup',
        VIOLATIONS: 'exam_violations_backup',
        TIMER_STATE: 'exam_timer_state',
        NETWORK_STATUS: 'exam_network_status'
    }
};

// ================= FULLSCREEN =================

/**
 * Enter fullscreen mode with cross-browser support
 */
export const enterFullscreen = async (element = document.documentElement) => {
    try {
        if (element.requestFullscreen) {
            await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            /* Safari */
            await element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            /* IE11 */
            await element.msRequestFullscreen();
        }
        return { success: true };
    } catch (error) {
        console.error("Fullscreen error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Exit fullscreen mode
 */
export const exitFullscreen = async () => {
    try {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            await document.msExitFullscreen();
        }
        return { success: true };
    } catch (error) {
        console.error("Exit fullscreen error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Check if currently in fullscreen
 */
export const isFullscreen = () => {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
};

/**
 * Listen for fullscreen changes
 */
export const onFullscreenChange = (callback) => {
    const handler = () => callback(isFullscreen());
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    document.addEventListener('msfullscreenchange', handler);
    return () => {
        document.removeEventListener('fullscreenchange', handler);
        document.removeEventListener('webkitfullscreenchange', handler);
        document.removeEventListener('msfullscreenchange', handler);
    };
};

// ================= KEYBOARD BLOCKING =================

/**
 * Block prohibited keyboard shortcuts
 */
export const blockKeyboardShortcuts = (e) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const isAlt = e.altKey;
    const key = e.key.toLowerCase();
    
    // Block function keys
    if (key.startsWith('f') && parseInt(key.slice(1)) >= 1 && parseInt(key.slice(1)) <= 12) {
        e.preventDefault();
        return { blocked: true, type: 'FUNCTION_KEY', key: e.key };
    }
    
    // Block Ctrl/Cmd + letter combinations
    const blockedLetters = ['c', 'v', 'x', 'u', 's', 'p', 'a', 'f', 'i', 'j', 'k', 'o', 'r', 't', 'w'];
    if (isCtrl && blockedLetters.includes(key)) {
        e.preventDefault();
        return { blocked: true, type: 'CTRL_COMBO', key: `Ctrl+${key.toUpperCase()}` };
    }
    
    // Block Ctrl+Shift combinations
    if (isCtrl && e.shiftKey && ['i', 'j', 'k'].includes(key)) {
        e.preventDefault();
        return { blocked: true, type: 'CTRL_SHIFT', key: `Ctrl+Shift+${key.toUpperCase()}` };
    }
    
    // Block Alt+Tab
    if (isAlt && key === 'tab') {
        e.preventDefault();
        return { blocked: true, type: 'ALT_TAB', key: 'Alt+Tab' };
    }
    
    // Block Ctrl+Tab
    if (isCtrl && key === 'tab') {
        e.preventDefault();
        return { blocked: true, type: 'CTRL_TAB', key: 'Ctrl+Tab' };
    }
    
    // Block Ctrl+Page navigation
    if (isCtrl && ['pageup', 'pagedown'].includes(key)) {
        e.preventDefault();
        return { blocked: true, type: 'CTRL_PAGE', key: `Ctrl+${key}` };
    }
    
    return { blocked: false };
};

// ================= CLIPBOARD PROTECTION =================

/**
 * Block copy operation
 */
export const blockCopy = (e) => {
    e.preventDefault();
    return true;
};

/**
 * Block paste operation
 */
export const blockPaste = (e) => {
    e.preventDefault();
    return true;
};

/**
 * Block cut operation
 */
export const blockCut = (e) => {
    e.preventDefault();
    return true;
};

/**
 * Block context menu (right-click)
 */
export const blockContextMenu = (e) => {
    e.preventDefault();
    return true;
};

// ================= TEXT SELECTION =================

/**
 * Block text selection (except in inputs)
 */
export const blockTextSelection = (e) => {
    const tagName = e.target.tagName.toUpperCase();
    const allowedTags = ['INPUT', 'TEXTAREA', 'SELECT'];
    
    if (allowedTags.includes(tagName)) {
        return false; // Allow selection in form elements
    }
    
    // Also check for contenteditable
    if (e.target.isContentEditable) {
        return false;
    }
    
    e.preventDefault();
    return true;
};

// ================= NETWORK STATUS =================

/**
 * Check current network status
 */
export const checkNetworkStatus = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    return {
        online: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
        timestamp: Date.now()
    };
};

/**
 * Listen for network changes
 */
export const onNetworkChange = (callback) => {
    const handler = () => {
        const status = checkNetworkStatus();
        callback(status);
    };
    
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);
    
    if (navigator.connection) {
        navigator.connection.addEventListener('change', handler);
    }
    
    return () => {
        window.removeEventListener('online', handler);
        window.removeEventListener('offline', handler);
        if (navigator.connection) {
            navigator.connection.removeEventListener('change', handler);
        }
    };
};

/**
 * Get network quality label
 */
export const getNetworkQuality = () => {
    const status = checkNetworkStatus();
    
    if (!status.online) {
        return { label: 'OFFLINE', color: 'red' };
    }
    
    switch (status.effectiveType) {
        case '4g':
            return { label: 'EXCELLENT', color: 'green' };
        case '3g':
            return { label: 'GOOD', color: 'yellow' };
        case '2g':
            return { label: 'SLOW', color: 'orange' };
        default:
            return { label: 'UNKNOWN', color: 'gray' };
    }
};

// ================= ANSWER BACKUP =================

/**
 * Save answers to localStorage for recovery
 */
export const backupAnswers = (answers, attemptId) => {
    try {
        const backup = {
            attemptId,
            answers,
            timestamp: Date.now()
        };
        localStorage.setItem(
            EXAM_SECURITY_CONFIG.STORAGE_KEYS.ANSWERS,
            JSON.stringify(backup)
        );
        return { success: true };
    } catch (error) {
        console.error("Backup answers error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Load answers from localStorage
 */
export const loadAnswersBackup = () => {
    try {
        const data = localStorage.getItem(EXAM_SECURITY_CONFIG.STORAGE_KEYS.ANSWERS);
        if (!data) return null;
        
        const backup = JSON.parse(data);
        
        // Check if backup is too old (24 hours)
        if (Date.now() - backup.timestamp > 24 * 60 * 60 * 1000) {
            clearAnswersBackup();
            return null;
        }
        
        return backup;
    } catch (error) {
        console.error("Load answers backup error:", error);
        return null;
    }
};

/**
 * Clear answers backup
 */
export const clearAnswersBackup = () => {
    localStorage.removeItem(EXAM_SECURITY_CONFIG.STORAGE_KEYS.ANSWERS);
};

/**
 * Save timer state to localStorage
 */
export const backupTimerState = (timerState) => {
    try {
        localStorage.setItem(
            EXAM_SECURITY_CONFIG.STORAGE_KEYS.TIMER_STATE,
            JSON.stringify({
                ...timerState,
                timestamp: Date.now()
            })
        );
    } catch (error) {
        console.error("Backup timer error:", error);
    }
};

/**
 * Load timer state from localStorage
 */
export const loadTimerState = () => {
    try {
        const data = localStorage.getItem(EXAM_SECURITY_CONFIG.STORAGE_KEYS.TIMER_STATE);
        if (!data) return null;
        
        const state = JSON.parse(data);
        
        // Calculate time elapsed since backup
        const elapsed = Date.now() - state.timestamp;
        
        return {
            ...state,
            elapsedSinceBackup: elapsed
        };
    } catch (error) {
        console.error("Load timer state error:", error);
        return null;
    }
};

// ================= VIOLATION LOGGING =================

/**
 * Create a violation log entry
 */
export const createViolationLog = (type, details = '', extra = {}) => {
    return {
        type,
        details,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        ...extra
    };
};

/**
 * Save violation to localStorage
 */
export const backupViolation = (violation) => {
    try {
        const violations = JSON.parse(
            localStorage.getItem(EXAM_SECURITY_CONFIG.STORAGE_KEYS.VIOLATIONS) || '[]'
        );
        violations.push(violation);
        localStorage.setItem(
            EXAM_SECURITY_CONFIG.STORAGE_KEYS.VIOLATIONS,
            JSON.stringify(violations)
        );
        return { success: true, count: violations.length };
    } catch (error) {
        console.error("Backup violation error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Get backed up violations
 */
export const getBackedUpViolations = () => {
    try {
        return JSON.parse(
            localStorage.getItem(EXAM_SECURITY_CONFIG.STORAGE_KEYS.VIOLATIONS) || '[]'
        );
    } catch (error) {
        return [];
    }
};

/**
 * Clear violations backup
 */
export const clearViolationsBackup = () => {
    localStorage.removeItem(EXAM_SECURITY_CONFIG.STORAGE_KEYS.VIOLATIONS);
};

/**
 * Get warning message based on violation count
 */
export const getWarningMessage = (violationCount) => {
    if (violationCount <= 0) return null;
    if (violationCount === 1) return EXAM_SECURITY_CONFIG.WARNING_MESSAGES[0];
    if (violationCount === 2) return EXAM_SECURITY_CONFIG.WARNING_MESSAGES[1];
    if (violationCount >= 3) return EXAM_SECURITY_CONFIG.WARNING_MESSAGES[2];
    return null;
};

/**
 * Check if should be disqualified
 */
export const shouldDisqualify = (timeOutsideMs) => {
    return timeOutsideMs >= EXAM_SECURITY_CONFIG.MAX_TIME_OUTSIDE;
};

// ================= DEVELOPER TOOLS =================

/**
 * Detect if developer tools are open
 * This uses multiple methods to increase detection reliability
 */
export const detectDevTools = () => {
    let detected = false;
    
    // Method 1: Size detection (most reliable)
    const threshold = 100;
    const widthDevTools = window.outerWidth - window.innerWidth > threshold;
    const heightDevTools = window.outerHeight - window.innerHeight > threshold;
    
    if (widthDevTools || heightDevTools) {
        detected = true;
    }
    
    // Method 2: Console detection
    const consoleMethods = ['log', 'debug', 'info', 'warn', 'error'];
    consoleMethods.forEach(method => {
        const original = console[method];
        console[method] = (...args) => {
            detected = true;
            return original.apply(console, args);
        };
    });
    
    // Restore console after 5 seconds
    setTimeout(() => {
        consoleMethods.forEach(method => {
            console[method] = console[method].bind(console);
        });
    }, 5000);
    
    // Method 3: Debugger statement (will pause execution if dev tools open)
    // This is commented out as it freezes the browser
    // try {
    //     debugger;
    // } catch (e) {
    //     detected = true;
    // }
    
    return detected;
};

/**
 * Listen for dev tools opening
 */
export const onDevToolsChange = (callback) => {
    // Use the sizes method for continuous detection
    const checkSizes = () => {
        const threshold = 100;
        const hasDevTools = 
            window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold;
        callback(hasDevTools);
    };
    
    // Check on resize
    window.addEventListener('resize', checkSizes);
    
    // Also check immediately
    checkSizes();
    
    return () => {
        window.removeEventListener('resize', checkSizes);
    };
};

// ================= PAGE VISIBILITY =================

/**
 * Check page visibility state
 */
export const isPageVisible = () => {
    return document.visibilityState === 'visible';
};

/**
 * Check if window has focus
 */
export const hasWindowFocus = () => {
    return document.hasFocus();
};

/**
 * Listen for visibility changes
 */
export const onVisibilityChange = (callback) => {
    document.addEventListener('visibilitychange', () => {
        callback(document.visibilityState);
    });
    
    return () => {
        document.removeEventListener('visibilitychange', () => {});
    };
};

/**
 * Listen for window focus/blur
 */
export const onWindowFocusChange = (onFocus, onBlur) => {
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    
    return () => {
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('blur', onBlur);
    };
};

// ================= TIME FORMATTING =================

/**
 * Format milliseconds to HH:MM:SS
 */
export const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format milliseconds to readable duration
 */
export const formatDuration = (ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ') || '0s';
};

/**
 * Format time outside
 */
export const formatTimeOutside = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
};

// ================= PAGE NAVIGATION =================

/**
 * Prevent page refresh/unload
 */
export const preventPageUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
    return e;
};

/**
 * Disable back button
 */
export const disableBackButton = () => {
    // Push current state to prevent going back
    window.history.pushState(null, null, window.location.href);
    
    // Handle back button press
    const handlePopState = () => {
        window.history.pushState(null, null, window.location.href);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
        window.removeEventListener('popstate', handlePopState);
    };
};

/**
 * Block browser navigation attempts
 */
export const blockNavigation = () => {
    // Push state to override back button
    window.history.pushState(null, null, window.location.href);
    
    // Block forward button too
    window.addEventListener('beforeunload', preventPageUnload);
    
    return () => {
        window.removeEventListener('beforeunload', preventPageUnload);
    };
};

// ================= AUTO-SAVE =================

/**
 * Create auto-saver for answers
 */
export const createAnswerAutoSaver = (getAnswers, attemptId, interval = 10000) => {
    let saveInterval = null;
    
    const save = () => {
        const answers = getAnswers();
        if (Object.keys(answers).length > 0) {
            backupAnswers(answers, attemptId);
        }
    };
    
    const start = () => {
        save(); // Save immediately
        saveInterval = setInterval(save, interval);
    };
    
    const stop = () => {
        if (saveInterval) {
            clearInterval(saveInterval);
            saveInterval = null;
        }
    };
    
    const clear = () => {
        stop();
        clearAnswersBackup();
    };
    
    return { start, stop, save, clear };
};

// ================= APPLY/REMOVE RESTRICTIONS =================

/**
 * Apply all security restrictions to document
 */
export const applySecurityRestrictions = () => {
    // Disable right-click
    document.addEventListener('contextmenu', blockContextMenu);
    
    // Disable text selection
    document.addEventListener('selectstart', blockTextSelection);
    
    // Disable keyboard shortcuts
    document.addEventListener('keydown', blockKeyboardShortcuts);
    
    // Disable copy/paste/cut
    document.addEventListener('copy', blockCopy);
    document.addEventListener('paste', blockPaste);
    document.addEventListener('cut', blockCut);
    
    // Prevent page unload
    window.addEventListener('beforeunload', preventPageUnload);
    
    // Disable back button
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', () => {
        window.history.pushState(null, null, window.location.href);
    });
};

/**
 * Remove all security restrictions
 */
export const removeSecurityRestrictions = () => {
    document.removeEventListener('contextmenu', blockContextMenu);
    document.removeEventListener('selectstart', blockTextSelection);
    document.removeEventListener('keydown', blockKeyboardShortcuts);
    document.removeEventListener('copy', blockCopy);
    document.removeEventListener('paste', blockPaste);
    document.removeEventListener('cut', blockCut);
    window.removeEventListener('beforeunload', preventPageUnload);
    window.removeEventListener('popstate', () => {});
};

// ================= SCREEN CAPTURE DETECTION =================

/**
 * Detect screen capture attempt (basic)
 */
export const detectScreenCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // Cannot reliably detect from web, return false
        return false;
    }
    return false;
};

/**
 * Listen for display media usage
 */
export const onDisplayMediaChange = (callback) => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
        return () => {};
    }
    
    const handleChange = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        });
        
        // Stream started
        callback({ started: true, stream });
        
        // Listen for stream end
        stream.getVideoTracks()[0].onended = () => {
            callback({ started: false, reason: 'ended' });
        };
    };
    
    // This requires user interaction to trigger
    return () => {};
};

// ================= EXPORT =================

export default {
    // Config
    EXAM_SECURITY_CONFIG,
    
    // Fullscreen
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    onFullscreenChange,
    
    // Keyboard
    blockKeyboardShortcuts,
    
    // Clipboard
    blockCopy,
    blockPaste,
    blockCut,
    blockContextMenu,
    
    // Selection
    blockTextSelection,
    
    // Network
    checkNetworkStatus,
    onNetworkChange,
    getNetworkQuality,
    
    // Answer Backup
    backupAnswers,
    loadAnswersBackup,
    clearAnswersBackup,
    createAnswerAutoSaver,
    
    // Timer State
    backupTimerState,
    loadTimerState,
    
    // Violations
    createViolationLog,
    backupViolation,
    getBackedUpViolations,
    clearViolationsBackup,
    getWarningMessage,
    shouldDisqualify,
    
    // Dev Tools
    detectDevTools,
    onDevToolsChange,
    
    // Visibility
    isPageVisible,
    hasWindowFocus,
    onVisibilityChange,
    onWindowFocusChange,
    
    // Time
    formatTime,
    formatDuration,
    formatTimeOutside,
    
    // Navigation
    preventPageUnload,
    disableBackButton,
    blockNavigation,
    
    // Restrictions
    applySecurityRestrictions,
    removeSecurityRestrictions,
    
    // Screen
    detectScreenCapture,
    onDisplayMediaChange
};

