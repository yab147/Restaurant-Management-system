import React, { useState } from 'react'
import Modal from '../ui/Modal'
import { useMenuItems } from '../../../features/menu/hooks/useMenu.js'
import { useTables } from '../../../features/tables/hooks/useTables.js'
import { useCreateOrder } from '../../../features/orders/hooks/useOrders.js'
import { useAuth } from '../../../providers/AuthProvider.jsx'
import { calculateOrderTotal } from '../../../features/orders/utils/orderUtils.js'

export default function CustomerModal({ isOpen, onClose, initialItems = [] }) {
  const { data: menuItems = [] } = useMenuItems();
  const { data: tables = [] } = useTables();
  const createOrderMutation = useCreateOrder();
  const { user } = useAuth();

  const [newForm, setNewForm] = useState({ customerName: '', tableId: '', type: 'dine-in', notes: '' });
  const [orderItems, setOrderItems] = useState([]);

  React.useEffect(() => {
    if (isOpen && Array.isArray(initialItems) && initialItems.length > 0) {
      setOrderItems(initialItems.map(id => ({ itemId: id, qty: 1 })));
    }
    if (!isOpen) {
      setOrderItems([]);
      setNewForm({ customerName: '', tableId: '', type: 'dine-in', notes: '' });
    }
  }, [isOpen, initialItems]);

  const addItemToOrder = (itemId) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.itemId === itemId);
      if (existing) return prev.map(i => i.itemId === itemId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { itemId, qty: 1 }];
    });
  };

  const handleCreateOrder = () => {
    if (!newForm.customerName || orderItems.length === 0) return;
    const table = tables.find(t => t.tableId === Number(newForm.tableId));
    const items = orderItems.map(oi => {
      const menu = menuItems.find(m => m.itemId === oi.itemId);
      return { itemId: oi.itemId, itemName: menu?.name, quantity: oi.qty, unitPrice: menu?.price, subTotal: (menu?.price || 0) * oi.qty };
    });
    const totalAmount = calculateOrderTotal(items.map(i => ({ unitPrice: i.unitPrice, quantity: i.quantity })));
    const waiterData = user?.role === 'waiter' ? { waiterId: user.userId, waiterName: user.name } : {};

    createOrderMutation.mutate({
      customerName: newForm.customerName, tableId: table?.tableId, tableNumber: table?.number,
      type: newForm.type, totalAmount, notes: newForm.notes, items,
      ...waiterData,
    }, {
      onSuccess: () => {
        setNewForm({ customerName: '', tableId: '', type: 'dine-in', notes: '' });
        setOrderItems([]);
        onClose();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Order" size="lg"
      footer={(
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer"
            style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
          <button onClick={handleCreateOrder} disabled={createOrderMutation.isPending}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>
            {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      )}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold" style={{ color: '#2C1810' }}>Order Details</h4>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Customer Name</label>
            <input value={newForm.customerName} onChange={e => setNewForm(p => ({ ...p, customerName: e.target.value }))}
              placeholder="Enter name" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Order Type</label>
            <select value={newForm.type} onChange={e => setNewForm(p => ({ ...p, type: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
              <option value="dine-in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          {newForm.type === 'dine-in' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Table</label>
              <select value={newForm.tableId} onChange={e => setNewForm(p => ({ ...p, tableId: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                <option value="">Select table</option>
                {tables.filter(t => t.status === 'available').map(t => (
                  <option key={t.tableId} value={t.tableId}>Table {t.number} ({t.capacity} seats)</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Selected Items</label>
            {orderItems.length === 0 ? (
              <p className="text-xs" style={{ color: '#8B6E52' }}>No items selected</p>
            ) : (
              <div className="space-y-2">
                {orderItems.map(oi => {
                  const menu = menuItems.find(m => m.itemId === oi.itemId);
                  return (
                    <div key={oi.itemId} className="flex items-center justify-between text-sm p-2 rounded-lg" style={{ background: '#FDF6EE' }}>
                      <span style={{ color: '#2C1810' }}>{menu?.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setOrderItems(p => p.map(i => i.itemId === oi.itemId ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0))}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                          style={{ background: '#F0E8DE', color: '#8B6E52' }}>−</button>
                        <span className="font-bold" style={{ color: '#C8862A' }}>{oi.qty}</span>
                        <button onClick={() => addItemToOrder(oi.itemId)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                          style={{ background: '#C8862A', color: 'white' }}>+</button>
                        <span className="text-xs" style={{ color: '#C8862A' }}>ETB {(menu?.price || 0) * oi.qty}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3" style={{ color: '#2C1810' }}>Select Items</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto animate-fadeIn">
            {menuItems.filter(m => m.availability).map(item => (
              <button key={item.itemId} onClick={() => addItemToOrder(item.itemId)}
                className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all hover:scale-[1.01] cursor-pointer"
                style={{ background: '#FDF6EE', border: '1px solid #F0E8DE' }}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#2C1810' }}>{item.name}</p>
                  <p className="text-xs" style={{ color: '#8B6E52' }}>ETB {item.price}</p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#C8862A', color: 'white' }}>+</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function CustomerOrderModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Orders" size="lg">
      <div>
        <h4 className='capitalize text-[#2C1810] font-semibold my-4 flex justify-start '>my orders</h4>
        {/* List of orders would go here */}
        <div className='flex justify-end mt-6'>
          <button className='bg-gray-300 hover:bg-gray-400 hover:cursor-pointer px-4 rounded-2xl shadow-2xl text-gray-800 font-bold mr-4' onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  )
}
