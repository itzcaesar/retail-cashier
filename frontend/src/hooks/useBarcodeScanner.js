import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for handling barcode scanner input in HID keyboard mode
 * Scanner sends keystrokes followed by ENTER
 */
export function useBarcodeScanner(onScan, options = {}) {
  const {
    minLength = 3,
    maxLength = 50,
    scanTimeout = 100, // ms between characters
    enabled = true
  } = options;

  const bufferRef = useRef('');
  const timeoutRef = useRef(null);

  const clearBuffer = useCallback(() => {
    bufferRef.current = '';
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (!enabled) return;

    // Ignore if user is typing in an input/textarea (except our hidden scanner input)
    const target = event.target;
    if (
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
      !target.classList.contains('barcode-scanner-input')
    ) {
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Handle ENTER key - process the scan
    if (event.key === 'Enter' && bufferRef.current.length >= minLength) {
      event.preventDefault();
      const scannedCode = bufferRef.current.trim();
      
      if (scannedCode) {
        onScan(scannedCode);
      }
      
      clearBuffer();
      return;
    }

    // Ignore special keys
    if (event.key.length > 1 && event.key !== 'Enter') {
      return;
    }

    // Add character to buffer
    if (event.key.length === 1) {
      event.preventDefault();
      bufferRef.current += event.key;

      // Prevent buffer overflow
      if (bufferRef.current.length > maxLength) {
        clearBuffer();
      }

      // Auto-clear buffer after timeout (in case scanner doesn't send ENTER)
      timeoutRef.current = setTimeout(() => {
        if (bufferRef.current.length >= minLength) {
          const scannedCode = bufferRef.current.trim();
          if (scannedCode) {
            onScan(scannedCode);
          }
        }
        clearBuffer();
      }, scanTimeout);
    }
  }, [enabled, minLength, maxLength, scanTimeout, onScan, clearBuffer]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleKeyPress]);

  return { clearBuffer };
}
