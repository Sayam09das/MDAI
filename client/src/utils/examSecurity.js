/**
 * Exam Security Utilities
 * All security-related functions for the secure examination system
 */

// Configuration constants
export const EXAM_SECURITY_CONFIG = {
    HEARTBEAT_INTERVAL: 30000, // 30 seconds
    MAX_TIME_OUTSIDE: 300000, // 5 minutes (300 seconds)
    MAX_VIOLATIONS: 5,
    HEARTBEAT_TIMEOUT: 120000, // 2 minutes
    WARNING_THRESHOLDS: [1, 3], // Violation counts for warnings
    WARNING_MESSAGES: [
        "⚠️ First Warning: Do not leave the exam window!",
        "⚠️ Second Warning: Multiple violations recorded!",
        "🚫 Final Warning: One more violation and you'll be disqualified!"
    ]
};

/**
 * Enter fullscreen mode
 */
export const enterFullscreen = async (element) => {
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
        return true;
    } catch (error) {
        console.error("Fullscreen error:", error);
        return false;
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
            /* Safari */
            await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE11 */
            await document.msExitFullscreen();
        }
        return true;
    } catch (error) {
        console.error("Exit fullscreen error:", error);
        return false;
    }
};

/**
 * Check if in fullscreen mode
 */
export const isFullscreen = () => {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
};

/**
 * Block keyboard shortcuts
 */
export const blockKeyboardShortcuts = (e) => {
    const blockedKeys = [
        'c', 'v', 'x', 'u', 's', 'p', 'a', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'n', 'o', 'q', 'r', 't', 'w', 'y', 'z'
    ];
    
    // Block Ctrl/Cmd + key combinations
    if (e.ctrlKey || e.metaKey) {
        if (blockedKeys.includes(e.key.toLowerCase())) {
            e.preventDefault();
            return true;
        }
    }
    
    // Block function keys
    if (e.key === 'F1' || e.key === 'F2' || e.key === 'F3' || 
        e.key === 'F4' || e.key === 'F5' || e.key === 'F6' || 
        e.key === 'F7' || e.key === 'F8' || e.key === 'F9' || 
        e.key === 'F10' || e.key === 'F11' || e.key === 'F12') {
        e.preventDefault();
        return true;
    }
    
    // Block Tab (prevent switching focus)
    if (e.key === 'Tab') {
        e.preventDefault();
        return true;
    }
    
    // Block Alt + Tab
    if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        return true;
    }
    
    // Block Ctrl + Tab / Ctrl + Shift + Tab
    if ((e.ctrlKey || e.metaKey) && (e.key === 'Tab' || e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        return true;
    }
    
    return false;
};

/**
 * Block right-click context menu
 */
export const blockContextMenu = (e) => {
    e.preventDefault();
    return true;
};

/**
 * Block text selection
 */
export const blockTextSelection = (e) => {
    // This is mainly handled via CSS, but we can add extra protection
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return false; // Allow selection in inputs
    }
    e.preventDefault();
    return true;
};

/**
 * Detect developer tools
 */
export const detectDevTools = () => {
    let detected = false;
    
    // Method 1: Check window dimensions
    const threshold = 100;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
        detected = true;
    }
    
    // Method 2: Console detection
    const consoleLog = console.log;
    console.log = function(...args) {
        detected = true;
        return consoleLog.apply(console, args);
    };
    
    // Method 3: Check for debugger
    const checkDebugger = () => {
        const start = Date.now();
        debugger;
        const end = Date.now();
        if (end - start > 100) {
            detected = true;
        }
    };
    
    // Method 4: Check for DevTools opening via specific events
    window.addEventListener('devtoolschange', (e) => {
        if (e.detail.open) {
            detected = true;
        }
    });
    
    // Restore console
    setTimeout(() => {
        console.log = consoleLog;
    }, 1000);
    
    return detected;
};

/**
 * Detect if page is visible
 */
export const isPageVisible = () => {
    return document.visibilityState === 'visible';
};

/**
 * Detect if window has focus
 */
export const hasWindowFocus = () => {
    return document.hasFocus();
};

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
 * Prevent page refresh/unload
 */
export const preventPageUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
    return e;
};

/**
 * Disable back button by manipulating history
 */
export const disableBackButton = () => {
    // Push current state to prevent going back
    window.history.pushState(null, null, window.location.href);
    
    // Handle back button press
    window.onpopstate = function() {
        window.history.go(1);
    };
};

/**
 * Apply all security restrictions to document
 */
export const applySecurityRestrictions = () => {
    // Disable right-click
    document.addEventListener('contextmenu', blockContextMenu);
    
    // Disable text selection (except inputs)
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
    disableBackButton();
};

/**
 * Remove all security restrictions
 */
export const removeSecurityRestrictions = () => {
    // Remove event listeners
    document.removeEventListener('contextmenu', blockContextMenu);
    document.removeEventListener('selectstart', blockTextSelection);
    document.removeEventListener('keydown', blockKeyboardShortcuts);
    document.removeEventListener('copy', blockCopy);
    document.removeEventListener('paste', blockPaste);
    document.removeEventListener('cut', blockCut);
    window.removeEventListener('beforeunload', preventPageUnload);
    
    window.onpopstate = null;
};

/**
 * Format time from milliseconds to MM:SS or HH:MM:SS
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
 * Format time outside in readable format
 */
export const formatTimeOutside = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
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
 * Check if should be disqualified based on time outside
 */
export const shouldDisqualify = (timeOutsideMs) => {
    return timeOutsideMs >= EXAM_SECURITY_CONFIG.MAX_TIME_OUTSIDE;
};

/**
 * Calculate remaining safe time outside
 */
export const getRemainingSafeTime = (timeOutsideMs) => {
    const remaining = EXAM_SECURITY_CONFIG.MAX_TIME_OUTSIDE - timeOutsideMs;
    return Math.max(0, remaining);
};

/**
 * Create violation log entry
 */
export const createViolationLog = (type, details = '') => {
    return {
        type,
        timestamp: new Date().toISOString(),
        details,
        userAgent: navigator.userAgent,
        pageUrl: window.location.href
    };
};

/**
 * Save violation to localStorage for backup
 */
export const backupViolation = (violation) => {
    const violations = JSON.parse(localStorage.getItem('exam_violations') || '[]');
    violations.push(violation);
    localStorage.setItem('exam_violations', JSON.stringify(violations));
};

/**
 * Get backed up violations
 */
export const getBackedUpViolations = () => {
    return JSON.parse(localStorage.getItem('exam_violations') || '[]');
};

/**
 * Clear backed up violations
 */
export const clearBackedUpViolations = () => {
    localStorage.removeItem('exam_violations');
};

/**
 * Network status checker
 */
export const checkNetworkStatus = () => {
    return {
        online: navigator.onLine,
        effectiveType: navigator.connection?.effectiveType,
        downlink: navigator.connection?.downlink
    };
};

/**
 * Detect screen capture attempt (basic)
 */
export const detectScreenCapture = () => {
    // Check if mediaDevices are available
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // This is a basic detection - real detection requires more sophisticated methods
        return false; // Cannot reliably detect screen capture from web
    }
    return false;
};

export default {
    EXAM_SECURITY_CONFIG,
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    blockKeyboardShortcuts,
    blockContextMenu,
    blockTextSelection,
    detectDevTools,
    isPageVisible,
    hasWindowFocus,
    blockCopy,
    blockPaste,
    blockCut,
    preventPageUnload,
    disableBackButton,
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
    checkNetworkStatus,
    detectScreenCapture
};

