import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP scroll animations
 * @param {object} options - Animation options
 * @param {string} options.animation - Type of animation: 'fadeInUp', 'fadeInLeft', 'fadeInRight', 'fadeIn', 'scaleUp', 'slideUp', 'stagger'
 * @param {number} options.delay - Delay in seconds
 * @param {number} options.duration - Duration in seconds
 * @param {string} options.ease - Easing function
 * @param {number} options.start - Start position (default: "top 80%")
 * @param {number} options.toggleActions - ScrollTrigger toggle actions
 * @param {boolean} options.stagger - Stagger delay between elements
 * @param {string} options.y - Y translation value
 * @param {string} options.x - X translation value
 * @param {number} options.scale - Scale value
 * @param {number} options.opacity - Opacity value
 */
const useGSAPScroll = (ref, options = {}) => {
    const {
        animation = 'fadeInUp',
        delay = 0,
        duration = 1,
        ease = 'power3.out',
        start = 'top 80%',
        toggleActions = 'play none none none',
        stagger = 0.1,
        y = '30px',
        x = '0px',
        scale = 1,
        opacity = 0
    } = options;

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        
        // Set initial state
        gsap.set(element, { opacity: 0 });

        let anim;

        switch (animation) {
            case 'fadeInUp':
                anim = gsap.to(element, {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay,
                    ease,
                    scrollTrigger: {
                        trigger: element,
                        start,
                        toggleActions,
                    }
                });
                break;
                
            case 'fadeInLeft':
                anim = gsap.to(element, {
                    opacity: 1,
                    x: 0,
                    duration,
                    delay,
                    ease,
                    scrollTrigger: {
                        trigger: element,
                        start,
                        toggleActions,
                    }
                });
                gsap.set(element, { x: '-50px' });
                break;
                
            case 'fadeInRight':
                anim = gsap.to(element, {
                    opacity: 1,
                    x: 0,
                    duration,
                    delay,
                    ease,
                    scrollTrigger: {
                        trigger: element,
                        start,
                        toggleActions,
                    }
                });
                gsap.set(element, { x: '50px' });
                break;
                
            case 'fadeIn':
                anim = gsap.to(element, {
                    opacity: 1,
                    duration,
                    delay,
                    ease,
                    scrollTrigger: {
                        trigger: element,
                        start,
                        toggleActions,
                    }
                });
                break;
                
            case 'scaleUp':
                anim = gsap.to(element, {
                    opacity: 1,
                    scale: 1,
                    duration,
                    delay,
                    ease,
                    scrollTrigger: {
                        trigger: element,
                        start,
                        toggleActions,
                    }
                });
                gsap.set(element, { scale: 0.8 });
                break;
                
            case 'slideUp':
                anim = gsap.fromTo(element, 
                    { y: 100, opacity },
                    {
                        y: 0,
                        opacity: 1,
                        duration,
                        delay,
                        ease,
                        scrollTrigger: {
                            trigger: element,
                            start,
                            toggleActions,
                        }
                    }
                );
                break;
                
            case 'stagger':
                // For staggered animations on children
                const children = element.children;
                if (children.length > 0) {
                    anim = gsap.fromTo(children,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration,
                            stagger,
                            delay,
                            ease,
                            scrollTrigger: {
                                trigger: element,
                                start,
                                toggleActions,
                            }
                        }
                    );
                }
                break;
                
            default:
                anim = gsap.to(element, {
                    opacity: 1,
                    duration,
                    delay,
                    ease,
                    scrollTrigger: {
                        trigger: element,
                        start,
                        toggleActions,
                    }
                });
        }

        return () => {
            if (anim && anim.scrollTrigger) {
                anim.scrollTrigger.kill();
            }
            anim?.kill();
        };
    }, [ref, animation, delay, duration, ease, start, toggleActions, stagger, y, x, scale, opacity]);
};

export default useGSAPScroll;

/**
 * Hook for animating multiple elements with stagger effect
 */
export const useGSAPStagger = (ref, options = {}) => {
    const {
        childSelector = '.animate-item',
        animation = 'fadeInUp',
        duration = 0.8,
        delay = 0,
        stagger = 0.15,
        ease = 'power3.out',
        start = 'top 85%',
        y = '40px'
    } = options;

    useEffect(() => {
        if (!ref.current) return;

        const elements = ref.current.querySelectorAll(childSelector);
        
        if (elements.length === 0) return;

        gsap.set(elements, { opacity: 0, y });
        
        const anim = gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            delay,
            ease,
            scrollTrigger: {
                trigger: ref.current,
                start,
                toggleActions: 'play none none none'
            }
        });

        return () => {
            anim.scrollTrigger?.kill();
            anim.kill();
        };
    }, [ref, childSelector, animation, duration, delay, stagger, ease, start, y]);
};

/**
 * Hook for parallax scrolling effect
 */
export const useGSAPParallax = (ref, options = {}) => {
    const {
        speed = 0.5,
        direction = 'y'
    } = options;

    useEffect(() => {
        if (!ref.current) return;

        const anim = gsap.to(ref.current, {
            [direction]: direction === 'y' ? `${speed * 100}px` : `${speed * 50}px`,
            ease: 'none',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        return () => {
            anim.scrollTrigger?.kill();
            anim.kill();
        };
    }, [ref, speed, direction]);
};

/**
 * Hook for count-up animation (great for statistics)
 */
export const useGSAPCountUp = (ref, endValue, options = {}) => {
    const {
        duration = 2,
        start = 0,
        ease = 'power2.out',
        startTrigger = 'top 80%'
    } = options;

    useEffect(() => {
        if (!ref.current) return;

        const obj = { value: start };
        
        const anim = gsap.to(obj, {
            value: endValue,
            duration,
            ease,
            scrollTrigger: {
                trigger: ref.current,
                start: startTrigger,
                toggleActions: 'play none none none'
            },
            onUpdate: () => {
                ref.current.textContent = Math.round(obj.value).toLocaleString();
            }
        });

        return () => {
            anim.scrollTrigger?.kill();
            anim.kill();
        };
    }, [ref, endValue, duration, start, ease, startTrigger]);
};

