/**
 * Transaction Success Modal - displays after successful checkout
 */
export default function TransactionSuccessModal({ isOpen, onClose, transaction, total, itemCount }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Transaction Complete!
          </h2>
          <p className="text-gray-600">
            Payment received successfully
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          {transaction?.id && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono font-semibold">#{transaction.id}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items:</span>
            <span className="font-semibold">{itemCount}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold">
              {new Date().toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between text-lg">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-green-600">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full btn-success text-lg py-3"
          >
            ✓ New Transaction
          </button>
          
          <button
            onClick={() => window.location.href = '/reports'}
            className="w-full btn-secondary text-lg py-3"
          >
            📊 View Reports
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Press <kbd className="px-2 py-0.5 bg-gray-200 rounded">ESC</kbd> or click anywhere to continue
          </p>
        </div>
      </div>
    </div>
  );
}
