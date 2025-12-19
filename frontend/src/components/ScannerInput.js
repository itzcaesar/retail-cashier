import { useEffect, useRef } from 'react';

/**
 * Hidden input component that captures scanner input and auto-focuses
 */
export default function ScannerInput({ onScan, placeholder = "Scan barcode..." }) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    
    if (value) {
      onScan(value);
      inputRef.current.value = '';
    }
    
    // Re-focus after scan
    inputRef.current.focus();
  };

  const handleBlur = () => {
    // Auto re-focus when input loses focus
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        ref={inputRef}
        type="text"
        className="barcode-scanner-input w-full p-4 text-2xl border-4 border-blue-500 rounded-lg focus:outline-none focus:border-blue-700"
        placeholder={placeholder}
        onBlur={handleBlur}
        autoComplete="off"
        autoFocus
      />
      <p className="text-sm text-gray-500 mt-2">
        👆 Scan barcode or type manually and press ENTER
      </p>
    </form>
  );
}
