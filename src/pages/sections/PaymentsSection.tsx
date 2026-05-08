import React, { useState } from 'react';
import { CreditCard, Smartphone, Banknote, CheckCircle, X, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment } from '../../types';

const PaymentsSection: React.FC = () => {
  const { orders, setOrders, payments, setPayments, currentUser } = useApp();
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'mobile'>('cash');
  const [receiptOrder, setReceiptOrder] = useState<number | null>(null);

  const unpaidOrders = orders.filter(o => o.status === 'served');
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const todayPayments = payments.filter(p => p.status === 'completed');

  const canProcess = ['admin', 'manager', 'cashier'].includes(currentUser?.role || '');

  const processPayment = () => {
    if (!selectedOrderId) return;
    const order = orders.find(o => o.orderId === selectedOrderId);
    if (!order) return;
    const newPayment: Payment = {
      paymentId: Date.now(),
      orderId: selectedOrderId,
      amount: order.totalAmount,
      method: payMethod,
      status: 'completed',
      paymentDate: new Date().toISOString(),
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
    };
    setPayments(prev => [...prev, newPayment]);
    setOrders(prev => prev.map(o => o.orderId === selectedOrderId ? { ...o, status: 'paid' } : o));
    setShowPayModal(false);
    setReceiptOrder(selectedOrderId);
    setSelectedOrderId(null);
  };

  const receiptOrderData = receiptOrder ? orders.find(o => o.orderId === receiptOrder) : null;
  const receiptPaymentData = receiptOrder ? payments.find(p => p.orderId === receiptOrder) : null;

  const methodBreakdown = {
    cash: payments.filter(p => p.method === 'cash' && p.status === 'completed').reduce((s, p) => s + p.amount, 0),
    card: payments.filter(p => p.method === 'card' && p.status === 'completed').reduce((s, p) => s + p.amount, 0),
    mobile: payments.filter(p => p.method === 'mobile' && p.status === 'completed').reduce((s, p) => s + p.amount, 0),
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Payments & Billing</h2>
        <p className="text-sm" style={{ color: '#8B6E52' }}>{unpaidOrders.length} orders awaiting payment</p>
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 col-span-2" style={{ background: 'linear-gradient(135deg, #1A1008, #2C1810)', border: '1px solid rgba(200,134,42,0.2)' }}>
          <p className="text-xs mb-1" style={{ color: '#8B6E52' }}>Total Revenue Collected</p>
          <p className="text-4xl font-black" style={{ color: '#C8862A', fontFamily: "'Playfair Display', serif" }}>
            ETB {totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs mt-1" style={{ color: '#6B4F3A' }}>From {payments.length} transactions</p>
        </div>
        {[
          { label: 'Cash', value: methodBreakdown.cash, icon: <Banknote size={18} />, color: '#059669', bg: '#ECFDF5' },
          { label: 'Card', value: methodBreakdown.card, icon: <CreditCard size={18} />, color: '#0369A1', bg: '#EFF6FF' },
          { label: 'Mobile', value: methodBreakdown.mobile, icon: <Smartphone size={18} />, color: '#7C3AED', bg: '#F5F3FF' },
        ].map((m, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: m.bg, border: `1px solid ${m.color}20` }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: m.color }}>{m.icon}<span className="text-xs font-semibold">{m.label}</span></div>
            <div className="text-xl font-black" style={{ color: m.color, fontFamily: "'Playfair Display', serif" }}>
              ETB {m.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Orders awaiting payment */}
      {canProcess && unpaidOrders.length > 0 && (
        <div>
          <h3 className="font-bold mb-3" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
            🔔 Orders Awaiting Payment ({unpaidOrders.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {unpaidOrders.map(order => (
              <div key={order.orderId} className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '2px solid #F0E8DE' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold" style={{ color: '#2C1810' }}>#{order.orderId} – {order.customerName}</p>
                    <p className="text-xs" style={{ color: '#8B6E52' }}>
                      {order.tableNumber ? `Table ${order.tableNumber}` : order.type} · {order.items.length} items
                    </p>
                  </div>
                  <p className="text-2xl font-black" style={{ color: '#C8862A', fontFamily: "'Playfair Display', serif" }}>
                    ETB {order.totalAmount}
                  </p>
                </div>
                <div className="space-y-1 mb-4">
                  {order.items.map(item => (
                    <div key={item.orderItemId} className="flex justify-between text-xs" style={{ color: '#8B6E52' }}>
                      <span>{item.quantity}× {item.itemName}</span>
                      <span>ETB {item.subTotal}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setSelectedOrderId(order.orderId); setShowPayModal(true); }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #059669, #065F46)', color: 'white' }}>
                  💳 Process Payment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment history */}
      <div>
        <h3 className="font-bold mb-3" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Transaction History</h3>
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F5E6D3' }}>
                {['Txn ID', 'Order', 'Amount', 'Method', 'Status', 'Date', 'Receipt'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#6B4F3A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...payments].reverse().map(p => {
                const order = orders.find(o => o.orderId === p.orderId);
                const methodIcons: Record<string, React.ReactNode> = {
                  cash: <Banknote size={14} className="text-green-600" />,
                  card: <CreditCard size={14} className="text-blue-600" />,
                  mobile: <Smartphone size={14} className="text-purple-600" />,
                };
                return (
                  <tr key={p.paymentId} className="border-t hover:bg-amber-50/30" style={{ borderColor: '#F0E8DE' }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: '#8B6E52' }}>{p.transactionId}</td>
                    <td className="px-4 py-3" style={{ color: '#2C1810' }}>
                      #{p.orderId} {order ? `– ${order.customerName}` : ''}
                    </td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#C8862A' }}>ETB {p.amount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 capitalize" style={{ color: '#6B4F3A' }}>
                        {methodIcons[p.method]} {p.method}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#8B6E52' }}>
                      {new Date(p.paymentDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setReceiptOrder(p.orderId)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                        style={{ background: '#F5E6D3', color: '#8B3A0F' }}>
                        <Receipt size={12} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: 'white' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Process Payment</h3>
              <button onClick={() => setShowPayModal(false)} style={{ color: '#8B6E52' }}><X size={20} /></button>
            </div>
            {selectedOrderId && (() => {
              const order = orders.find(o => o.orderId === selectedOrderId);
              return order ? (
                <div>
                  <div className="p-4 rounded-xl mb-5" style={{ background: '#FDF6EE', border: '1px solid #E8D5C0' }}>
                    <p className="font-bold" style={{ color: '#2C1810' }}>Order #{order.orderId} – {order.customerName}</p>
                    <p className="text-3xl font-black mt-2" style={{ color: '#C8862A', fontFamily: "'Playfair Display', serif" }}>
                      ETB {order.totalAmount}
                    </p>
                  </div>
                  <div className="mb-5">
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-3" style={{ color: '#6B4F3A' }}>Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { method: 'cash' as const, label: 'Cash', icon: <Banknote size={20} /> },
                        { method: 'card' as const, label: 'Card', icon: <CreditCard size={20} /> },
                        { method: 'mobile' as const, label: 'Mobile', icon: <Smartphone size={20} /> },
                      ]).map(m => (
                        <button key={m.method} onClick={() => setPayMethod(m.method)}
                          className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all"
                          style={payMethod === m.method
                            ? { background: '#C8862A', color: 'white' }
                            : { background: '#F0E8DE', color: '#6B4F3A' }}>
                          {m.icon} {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowPayModal(false)} className="flex-1 py-3 rounded-xl text-sm" style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
                    <button onClick={processPayment}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #059669, #065F46)', color: 'white' }}>
                      <CheckCircle size={16} /> Confirm
                    </button>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptOrder && receiptOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'white' }}>
            <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #1A1008, #2C1810)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>✦</div>
              <h3 className="text-white font-black text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>HOLY RESTAURANT</h3>
              <p className="text-xs" style={{ color: '#8B6E52' }}>Dire Dawa, Ethiopia</p>
              <p className="text-xs mt-1" style={{ color: '#8B6E52' }}>Tel: +251 25 111 2345</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-4 pb-4 border-b" style={{ borderColor: '#F0E8DE', borderStyle: 'dashed' }}>
                <p className="text-xs" style={{ color: '#8B6E52' }}>Order #{receiptOrderData.orderId}</p>
                <p className="font-bold" style={{ color: '#2C1810' }}>{receiptOrderData.customerName}</p>
                <p className="text-xs" style={{ color: '#8B6E52' }}>{new Date(receiptOrderData.orderDate).toLocaleString()}</p>
              </div>
              <div className="space-y-2 mb-4">
                {receiptOrderData.items.map(item => (
                  <div key={item.orderItemId} className="flex justify-between text-sm">
                    <span style={{ color: '#6B4F3A' }}>{item.quantity}× {item.itemName}</span>
                    <span style={{ color: '#2C1810' }}>ETB {item.subTotal}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t mb-4" style={{ borderColor: '#F0E8DE', borderStyle: 'dashed' }}>
                <div className="flex justify-between font-black text-lg">
                  <span style={{ color: '#2C1810' }}>TOTAL</span>
                  <span style={{ color: '#C8862A' }}>ETB {receiptOrderData.totalAmount}</span>
                </div>
                {receiptPaymentData && (
                  <p className="text-xs text-center mt-2 capitalize" style={{ color: '#8B6E52' }}>
                    Paid via {receiptPaymentData.method} · {receiptPaymentData.transactionId}
                  </p>
                )}
              </div>
              <p className="text-center text-xs mb-4" style={{ color: '#8B6E52' }}>
                ✦ Thank you for dining with us! ✦<br />
                አመሰግናለሁ
              </p>
              <button onClick={() => setReceiptOrder(null)} className="w-full py-3 rounded-xl text-sm font-medium"
                style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsSection;
