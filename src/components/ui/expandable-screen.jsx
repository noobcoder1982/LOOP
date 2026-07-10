import React, { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ExpandableScreenContext = createContext(null);

export const useExpandableScreen = () => {
  const context = useContext(ExpandableScreenContext);
  if (!context) {
    throw new Error('useExpandableScreen must be used within an ExpandableScreen provider');
  }
  return context;
};

export const ExpandableScreen = ({
  children,
  layoutId = 'expandable-card',
  triggerRadius = '100px',
  contentRadius = '28px',
  animationDuration = 0.45,
  defaultExpanded = false,
  onExpandChange,
  lockScroll = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const expand = () => {
    setIsExpanded(true);
    if (onExpandChange) onExpandChange(true);
  };

  const collapse = () => {
    setIsExpanded(false);
    if (onExpandChange) onExpandChange(false);
  };

  useEffect(() => {
    if (lockScroll) {
      if (isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (lockScroll) document.body.style.overflow = '';
    };
  }, [isExpanded, lockScroll]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        collapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <ExpandableScreenContext.Provider
      value={{
        isExpanded,
        expand,
        collapse,
        layoutId,
        triggerRadius,
        contentRadius,
        animationDuration
      }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  );
};

export const ExpandableScreenTrigger = ({ children, className = '' }) => {
  const { isExpanded, expand, layoutId, triggerRadius, animationDuration } = useExpandableScreen();

  return (
    <AnimatePresence mode="wait">
      {!isExpanded && (
        <motion.div
          layoutId={layoutId}
          style={{ borderRadius: triggerRadius }}
          onClick={expand}
          className={`cursor-pointer ${className}`}
          transition={{ duration: animationDuration, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ExpandableScreenContent = ({
  children,
  className = '',
  showCloseButton = true,
  closeButtonClassName = ''
}) => {
  const { isExpanded, collapse, layoutId, contentRadius, animationDuration } = useExpandableScreen();

  return createPortal(
    <AnimatePresence>
      {isExpanded && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 md:p-12">
          <motion.div
            layoutId={layoutId}
            style={{ borderRadius: contentRadius }}
            className={`relative overflow-y-auto w-full h-full max-w-6xl bg-[#090909] border border-white/10 shadow-2xl p-6 sm:p-10 lg:p-16 flex flex-col justify-start items-center ${className}`}
            transition={{ duration: animationDuration, ease: [0.16, 1, 0.3, 1] }}
          >
            {showCloseButton && (
              <button
                onClick={collapse}
                className={`absolute top-6 right-6 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors ${closeButtonClassName}`}
                aria-label="Close waitlist screen"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <div className="w-full h-full">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
