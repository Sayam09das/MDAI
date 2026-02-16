import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track element visibility using Intersection Observer
 * @param {object} options - Intersection Observer options
 * @param {number} options.threshold - Threshold for visibility (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @returns {[boolean, React.RefObject]}
 */
export const useElementVisibility = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);
    const { threshold = 0.1, rootMargin = '0px' } = options;

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
            observer.disconnect();
        };
    }, [threshold, rootMargin]);

    return [isVisible, elementRef];
};

/**
 * Custom hook to track page/document visibility (when user switches tabs)
 * @returns {boolean} - Whether the page/tab is visible
 */
export const usePageVisibility = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return isVisible;
};

export default useElementVisibility;

