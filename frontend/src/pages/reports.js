import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getDailyReport } from '@/lib/api';

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    loadReport();
  }, [selectedDate]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const response = await getDailyReport(selectedDate);
      setReport(response.data);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Daily Sales Report - POS Cashier</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">📊 Daily Sales Report</h1>
                <p className="text-gray-600 mt-2">View sales performance and top products</p>
              </div>
              <Link href="/" className="btn-secondary">
                ← Back to POS
              </Link>
            </div>
          </div>

          {/* Date Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <label className="block text-sm font-medium mb-2">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-3 border rounded-lg text-lg"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Loading report...</p>
            </div>
          ) : report ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-sm text-gray-600 mb-2">Total Sales</p>
                  <p className="text-3xl font-bold text-green-600">
                    Rp {report.summary.totalSales.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-sm text-gray-600 mb-2">Transactions</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {report.summary.transactionCount}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-sm text-gray-600 mb-2">Items Sold</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {report.summary.itemsSold}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-sm text-gray-600 mb-2">Avg Transaction</p>
                  <p className="text-3xl font-bold text-orange-600">
                    Rp {report.summary.averageTransactionValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">🏆 Top Selling Products</h2>
                
                {report.topProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No sales for this date</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">Rank</th>
                          <th className="text-left p-3">Product</th>
                          <th className="text-right p-3">Quantity Sold</th>
                          <th className="text-right p-3">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.topProducts.map((product, index) => (
                          <tr key={product.productId} className="border-t">
                            <td className="p-3 font-bold text-gray-600">#{index + 1}</td>
                            <td className="p-3 font-medium">{product.productName}</td>
                            <td className="p-3 text-right">{product.quantitySold}</td>
                            <td className="p-3 text-right font-semibold">
                              Rp {product.revenue.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
                
                {report.transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No transactions for this date</p>
                ) : (
                  <div className="space-y-3">
                    {report.transactions.slice(0, 10).map(transaction => (
                      <div key={transaction.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Transaction #{transaction.id}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.createdAt).toLocaleTimeString('id-ID')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {transaction.itemCount} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">
                              Rp {parseFloat(transaction.totalAmount).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
