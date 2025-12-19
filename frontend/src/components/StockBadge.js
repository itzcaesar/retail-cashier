/**
 * Stock level indicator badge
 */
export default function StockBadge({ stock, threshold = 10 }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
        ⚠️ Out of Stock
      </span>
    );
  }

  if (stock < threshold) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
        ⚡ Low Stock ({stock})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
      ✓ In Stock ({stock})
    </span>
  );
}
