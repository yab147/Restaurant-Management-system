import { useState } from 'react';
import { Receipt, CreditCard, DollarSign, Smartphone, Search, FileText } from 'lucide-react';
import { Order, PaymentMethod, PaymentStatus, OrderStatus } from '../../../types';

// Mock Data
const MOCK_BILLS: (Order & { customerName?: string })[] = [
  { orderId: 101, tableId: 2, type: 'Dine-in', status: OrderStatus.Served, orderDate: new Date().toISOString(), totalAmount: 45.50, items: [] },
  { orderId: 102, type: 'Takeaway', customerName: 'John Doe', status: OrderStatus.Served, orderDate: new Date().toISOString(), totalAmount: 28.00, items: [] },
  { orderId: 103, tableId: 5, type: 'Dine-in', status: OrderStatus.Served, orderDate: new Date().toISOString(), totalAmount: 112.75, items: [] },
  { orderId: 104, type: 'Delivery', customerName: 'Sarah Smith', status: OrderStatus.Pending, orderDate: new Date().toISOString(), totalAmount: 65.20, items: [] },
];

export function Billing() {
  const [bills, setBills] = useState(MOCK_BILLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<number | null>(null);

  const pendingBills = bills.filter(b => b.status !== OrderStatus.Paid);
  
  const handlePayment = (orderId: number, method: PaymentMethod) => {
    setBills(bills.map(b => 
      b.orderId === orderId ? { ...b, status: OrderStatus.Paid } : b
    ));
    setSelectedBill(null);
    alert(`Payment of $${bills.find(b => b.orderId === orderId)?.totalAmount} processed via ${method} for Order #${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Process payments and generate receipts</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">Today's Revenue</p>
            <p className="font-bold text-green-600 text-lg">$1,245.50</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bills List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or Table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {pendingBills.map(bill => (
              <div 
                key={bill.orderId}
                onClick={() => setSelectedBill(bill.orderId)}
                className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${
                  selectedBill === bill.orderId ? 'border-orange-500' : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">Order #{bill.orderId}</h3>
                    <p className="text-sm text-gray-500">
                      {bill.type} {bill.tableId ? `- Table ${bill.tableId}` : ''}
                      {bill.customerName ? `- ${bill.customerName}` : ''}
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                    Pending
                  </span>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="text-gray-500 text-sm">
                    {new Date(bill.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="font-bold text-lg text-gray-900">
                    ${bill.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            {pendingBills.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No pending bills to process.</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Processing Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h2 className="font-bold text-gray-900">Payment Details</h2>
            </div>
            
            {selectedBill ? (() => {
              const bill = bills.find(b => b.orderId === selectedBill)!;
              return (
                <div className="p-4 space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">${(bill.totalAmount * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Tax (10%)</span>
                      <span className="font-medium">${(bill.totalAmount * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-3 pt-3 flex justify-between">
                      <span className="font-bold text-gray-900">Total Amount</span>
                      <span className="font-bold text-2xl text-orange-600">${bill.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Select Payment Method</p>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => handlePayment(bill.orderId, PaymentMethod.Cash)}
                        className="flex items-center gap-3 w-full p-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-left"
                      >
                        <div className="bg-green-100 p-2 rounded-md">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">Cash Payment</span>
                      </button>
                      <button 
                        onClick={() => handlePayment(bill.orderId, PaymentMethod.Card)}
                        className="flex items-center gap-3 w-full p-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-left"
                      >
                        <div className="bg-blue-100 p-2 rounded-md">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Card Payment</span>
                      </button>
                      <button 
                        onClick={() => handlePayment(bill.orderId, PaymentMethod.Mobile)}
                        className="flex items-center gap-3 w-full p-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-left"
                      >
                        <div className="bg-purple-100 p-2 rounded-md">
                          <Smartphone className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">Mobile Wallet</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                     <button className="flex items-center justify-center gap-2 w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">
                        <FileText className="w-4 h-4" />
                        Print Bill
                     </button>
                  </div>
                </div>
              );
            })() : (
              <div className="p-8 text-center text-gray-500">
                <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>Select a bill from the list to process payment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
