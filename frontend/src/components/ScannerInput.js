import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import CameraScanner to avoid SSR issues with html5-qrcode
const CameraScanner = dynamic(() => import('./CameraScanner'), {
  ssr: false,
  loading: () => <p>Loading scanner...</p>
});

/**
 * Scanner input component with auto-focus and visual feedback
 */
export default function ScannerInput({ onScan, placeholder = "Scan barcode...", disabled = false }) {
  const inputRef = useRef(null);
  const [isActive, setIsActive] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current && !disabled && !showCamera) {
      inputRef.current.focus();
      setIsActive(true);
    }
  }, [disabled, showCamera]);

  // Re-focus on any click outside
  useEffect(() => {
    const handleGlobalClick = () => {
      if (inputRef.current && !disabled && !showCamera) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [disabled, showCamera]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    
    if (value && !disabled) {
      await processScan(value);
    }
  };

  const processScan = async (code) => {
    setIsScanning(true);
    try {
      await onScan(code);
    } finally {
      setIsScanning(false);
      // If camera was open, close it
      setShowCamera(false);

      // Clear input and refocus
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  };

  const handleBlur = () => {
    setIsActive(false);
    // Auto re-focus when input loses focus (only if camera is not active)
    if (!disabled && !showCamera) {
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
    <>
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            disabled={disabled || isScanning || showCamera}
            className={`barcode-scanner-input w-full p-4 pr-16 text-xl md:text-3xl font-mono border-4 rounded-lg focus:outline-none transition-all ${
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

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
             {/* Camera Toggle Button */}
             <button
              type="button"
              onClick={() => setShowCamera(true)}
              disabled={disabled || isScanning}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Scan with Camera"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-600">
            {isScanning ? (
              <span className="text-yellow-600 font-medium">⏳ Processing scan...</span>
            ) : (
              <span>📷 Ready to scan • Click camera icon for mobile</span>
            )}
          </p>
          <p className="text-xs text-gray-400">
            {isActive ? '🟢 Key Active' : '🔴 Key Inactive'}
          </p>
        </div>
      </div>

      {showCamera && (
        <CameraScanner
          onScan={processScan}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}
