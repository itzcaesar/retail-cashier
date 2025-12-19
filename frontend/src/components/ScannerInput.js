import { useEffect, useRef, useState } from 'react';

/**
 * Scanner input component with auto-focus and visual feedback
 */
export default function ScannerInput({ onScan, placeholder = "Scan barcode...", disabled = false }) {
  const inputRef = useRef(null);
  const [isActive, setIsActive] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
      setIsActive(true);
    }
  }, [disabled]);

  // Re-focus on any click outside
  useEffect(() => {
    const handleGlobalClick = () => {
      if (inputRef.current && !disabled) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [disabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    
    if (value && !disabled) {
      setIsScanning(true);
      try {
        await onScan(value);
      } finally {
        setIsScanning(false);
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  };

  const handleBlur = () => {
    setIsActive(false);
    // Auto re-focus when input loses focus
    if (!disabled) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          setIsActive(true);
        }
      }, 100);
    }
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled || isScanning}
          className={`barcode-scanner-input w-full p-5 text-2xl md:text-3xl font-mono border-4 rounded-lg focus:outline-none transition-all ${
            disabled 
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
              : isScanning
              ? 'border-yellow-500 bg-yellow-50 animate-pulse'
              : isActive
              ? 'border-blue-600 bg-blue-50 shadow-lg'
              : 'border-blue-400 bg-white'
          }`}
          placeholder={isScanning ? "Processing..." : placeholder}
          onBlur={handleBlur}
          onFocus={handleFocus}
          autoComplete="off"
          autoFocus
        />
        {isActive && !disabled && !isScanning && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-gray-600">
          {isScanning ? (
            <span className="text-yellow-600 font-medium">⏳ Processing scan...</span>
          ) : (
            <span>📷 Ready to scan • Click anywhere to refocus</span>
          )}
        </p>
        <p className="text-xs text-gray-400">
          {isActive ? '🟢 Active' : '🔴 Inactive'}
        </p>
      </div>
    </form>
  );
}
