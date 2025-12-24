import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

export default function CameraScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const [scanError, setScanError] = useState(null);

  useEffect(() => {
    // Unique ID for the scanner element
    const scannerId = "html5-qrcode-reader";

    // Configuration
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };

    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      scannerId,
      config,
      /* verbose= */ false
    );

    // Success callback
    const onScanSuccess = (decodedText, decodedResult) => {
      // Pause or clear the scanner before calling onScan
      // to prevent multiple scans of the same code
      scanner.clear().then(() => {
        onScan(decodedText);
        // We typically don't close here, we let the parent component decide when to unmount/close
        // But for this use case, we might want to close immediately or just wait for parent.
        // The parent is expected to unmount this component or we clear it.
      }).catch(err => {
        console.error("Failed to clear scanner", err);
      });
    };

    // Error callback
    const onScanFailure = (error) => {
      // console.warn(`Code scan error = ${error}`);
      // Usually better to ignore these errors as they happen for every frame that doesn't contain a barcode
    };

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Scan Barcode</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 bg-gray-100">
          <div id="html5-qrcode-reader" className="w-full"></div>
        </div>

        <div className="p-4 text-center text-sm text-gray-600 bg-white border-t">
          Point camera at a barcode to scan
        </div>
      </div>
    </div>
  );
}
