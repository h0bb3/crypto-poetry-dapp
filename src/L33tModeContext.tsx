import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, RefObject } from 'react';

interface L33tModeContextType {
  isL33tMode: boolean;
  toggleL33tMode: () => void;
  transformToL33t: (text: string) => string;
  useAutoL33t: (exclude?: string[]) => RefObject<HTMLDivElement>;
}

const L33tModeContext = createContext<L33tModeContextType | undefined>(undefined);

export const L33tModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isL33tMode, setIsL33tMode] = useState(false);

  const toggleL33tMode = () => {
    console.log('Toggling L33t Mode');
    setIsL33tMode(prev => !prev);
  };

  const transformToL33t = (text: string): string => {
    return text.replace(/[eEaAoOsS]/g, (char) => {
      switch (char.toLowerCase()) {
        case 'e': return '3';
        case 'a': return '4';
        case 'o': return '0';
        case 's': return '2';
        case 'l': return '1';
        default: return char;
      }
    });
  };

  const reverseL33t = (text: string): string => {
    return text.replace(/[3402]/g, (char) => {
      switch (char) {
        case '3': return 'e';
        case '4': return 'a';
        case '0': return 'o';
        case '2': return 's';
        case '1': return 'l';
        default: return char;
      }
    });
  };

  const useAutoL33t = (exclude: string[] = []): RefObject<HTMLDivElement> => {
    const ref = useRef<HTMLDivElement>(null);
    const originalTexts = useRef(new Map<Element, string>());

    useEffect(() => {
      if (!ref.current) return;

      const applyTransformation = () => {
        if (!ref.current) return;

        const elementsToTransform = ref.current.querySelectorAll('*:not(script):not(style)');
        elementsToTransform.forEach(el => {
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && !exclude.some(selector => el.matches(selector))) {
            if (!originalTexts.current.has(el)) {
              originalTexts.current.set(el, el.textContent || '');
            }
            const originalText = originalTexts.current.get(el) || '';
            el.textContent = isL33tMode ? transformToL33t(originalText) : originalText;
          }
        });
      };

      const scheduleTransformation = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(applyTransformation);
        } else {
          setTimeout(applyTransformation, 0);
        }
      };

      scheduleTransformation();

      const observer = new MutationObserver(scheduleTransformation);

      observer.observe(ref.current, { 
        childList: true, 
        subtree: true, 
        characterData: true 
      });

      return () => observer.disconnect();
    }, [isL33tMode, exclude]);

    return ref;
  };

  return (
    <L33tModeContext.Provider value={{ isL33tMode, toggleL33tMode, transformToL33t, useAutoL33t }}>
      {children}
    </L33tModeContext.Provider>
  );
};

export const useL33tMode = () => {
  const context = useContext(L33tModeContext);
  if (context === undefined) {
    throw new Error('useL33tMode must be used within a L33tModeProvider');
  }
  return context;
};