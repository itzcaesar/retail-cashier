import { useEffect } from 'react';

/**
 * Hook for handling keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to callback functions
 * Example: { 'ctrl+k': () => console.log('Ctrl+K pressed') }
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Build key combination string
      const keys = [];
      if (event.ctrlKey || event.metaKey) keys.push('ctrl');
      if (event.altKey) keys.push('alt');
      if (event.shiftKey) keys.push('shift');
      
      // Add the actual key (lowercase)
      if (event.key.length === 1) {
        keys.push(event.key.toLowerCase());
      } else if (event.key === 'Enter') {
        keys.push('enter');
      } else if (event.key === 'Escape') {
        keys.push('esc');
      } else if (event.key === 'Delete') {
        keys.push('delete');
      }

      const combination = keys.join('+');

      // Check if this combination has a handler
      if (shortcuts[combination]) {
        // Don't trigger if user is typing in an input/textarea
        const target = event.target;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }

        event.preventDefault();
        shortcuts[combination]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
