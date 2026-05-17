import React, { useState } from 'react';
import { useAuth } from '../../../providers/AuthProvider.jsx';
import { useOrders, useUpdateOrderStatus, useAssignOrderToWaiter } from '../hooks/useOrders.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Spinner from '../../../shared/components/ui/Spinner.jsx';
import { getNextStatus, isTerminalStatus, formatOrderId } from '../utils/orderUtils.js';

export default function WaiterDashboard() {
  const { user } = useAuth();
  const waiterId = user?.userId;

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.ORDERS_EDIT);

  const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'served'];
  const [selectedStatus, setSelectedStatus] = useState('all');

  const assignedFilters = React.useMemo(() => {
    const base = {};
    if (waiterId !== undefined && waiterId !== null) base.waiterId = waiterId;
    if (selectedStatus && selectedStatus !== 'all') base.status = selectedStatus;
    return base;
  }, [selectedStatus, waiterId]);

  const { data: assignedOrders = [], isLoading: isAssignedLoading } = useOrders(assignedFilters);
  const { data: availableOrders = [], isLoading: isAvailableLoading } = useOrders({ status: 'pending', unassigned: true });
  const updateStatus = useUpdateOrderStatus();
  const assignOrder = useAssignOrderToWaiter();

  const isLoading = isAssignedLoading || isAvailableLoading;
  const activeAssigned = assignedOrders.filter(o => !isTerminalStatus(o.status));

  const ORDER_SECTIONS = [
    { status: 'pending', title: 'Pending orders' },
    { status: 'confirmed', title: 'Confirmed orders' },
    { status: 'preparing', title: 'Preparing orders' },
    { status: 'ready', title: 'Ready to serve' },
    { status: 'served', title: 'Served orders' },
  ];

  const groupedOrders = ORDER_SECTIONS.reduce((acc, section) => {
    acc[section.status] = assignedOrders.filter(order => order.status === section.status);
    return acc;
  }, {});

  const handleAdvance = (orderId, nextStatus) => {
    if (!canEdit) return;
    updateStatus.mutate({ orderId, status: nextStatus });
  };

  const handleTakeOrder = (orderId) => {
    if (!waiterId) return;
    assignOrder.mutate({ orderId, waiterId, waiterName: user?.name, status: 'confirmed' });
  };

  if (isLoading) return <div className="py-16"><Spinner size="lg" /></div>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Waiter dashboard</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>{activeAssigned.length} active orders assigned to you</p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#2C1810' }}>My assigned tasks</h3>
              <p className="text-xs" style={{ color: '#8B6E52' }}>Orders grouped by workflow status so you can focus on confirmed, preparing and ready tasks.</p>
            </div>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: '#E6F8F0', color: '#047857' }}>
              {assignedOrders.length} orders
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${selectedStatus === status ? 'bg-[#C8862A] text-white' : 'bg-white text-[#8B6E52] border border-[#E8D5C0]'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {assignedOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#C8862A] bg-[#FFFBF3] p-8 text-center" style={{ color: '#8B6E52' }}>
            No orders assigned yet. Grab a pending order below to start your workflow.
          </div>
        ) : (
          ORDER_SECTIONS.map(section => {
            const sectionOrders = groupedOrders[section.status];
            if (!sectionOrders?.length) return null;
            return (
              <div key={section.status} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-semibold" style={{ color: '#2C1810' }}>{section.title}</h4>
                    <p className="text-xs" style={{ color: '#8B6E52' }}>
                      {sectionOrders.length} {sectionOrders.length === 1 ? 'order' : 'orders'}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold" style={{ color: '#92400E' }}>
                    {section.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                  {sectionOrders.map(order => {
                    const nextStatus = getNextStatus(order.status);
                    return (
                      <article key={order.orderId} className="rounded-3xl border border-[#F0E8DE] bg-white p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-black text-base" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>{formatOrderId(order.orderId)}</span>
                              <Badge status={order.status} />
                            </div>
                            <p className="font-semibold text-sm" style={{ color: '#2C1810' }}>{order.customerName}</p>
                            <p className="text-xs" style={{ color: '#8B6E52' }}>{order.tableNumber ? `Table ${order.tableNumber}` : order.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-lg" style={{ color: '#C8862A', fontFamily: "'Playfair Display', serif" }}>ETB {order.totalAmount}</p>
                            <p className="text-xs" style={{ color: '#8B6E52' }}>{order.items?.length} items</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {order.items?.map(item => (
                            <span key={item.orderItemId} className="rounded-full bg-[#F5E6D3] px-2 py-0.5 text-[11px]" style={{ color: '#8B6E52' }}>
                              {item.quantity}× {item.itemName}
                            </span>
                          ))}
                        </div>
                        {canEdit && nextStatus && (
                          <button onClick={() => handleAdvance(order.orderId, nextStatus)}
                            className="w-full rounded-2xl bg-[#F0E8DE] py-2 text-sm font-semibold text-[#8B3A0F] transition hover:opacity-90">
                            → Mark as {nextStatus}
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#2C1810' }}>Available orders</h3>
            <p className="text-xs" style={{ color: '#8B6E52' }}>Pending orders without an assigned waiter.</p>
          </div>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: '#FEF3C7', color: '#92400E' }}>
            {availableOrders.length} open orders
          </span>
        </div>

        {availableOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#C8862A] bg-[#FFFBF3] p-8 text-center" style={{ color: '#8B6E52' }}>
            No open orders available to take right now.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {availableOrders.map(order => (
              <article key={order.orderId} className="rounded-3xl border border-[#F0E8DE] bg-white p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-black text-base" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>{formatOrderId(order.orderId)}</span>
                      <Badge status={order.status} />
                    </div>
                    <p className="font-semibold text-sm" style={{ color: '#2C1810' }}>{order.customerName}</p>
                    <p className="text-xs" style={{ color: '#8B6E52' }}>{order.tableNumber ? `Table ${order.tableNumber}` : order.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg" style={{ color: '#C8862A', fontFamily: "'Playfair Display', serif" }}>ETB {order.totalAmount}</p>
                    <p className="text-xs" style={{ color: '#8B6E52' }}>{order.items?.length} items</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {order.items?.map(item => (
                    <span key={item.orderItemId} className="rounded-full bg-[#F5E6D3] px-2 py-0.5 text-[11px]" style={{ color: '#8B6E52' }}>
                      {item.quantity}× {item.itemName}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleTakeOrder(order.orderId)}
                  disabled={assignOrder.isLoading}
                  className="w-full rounded-2xl py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: '#059669' }}
                >
                  {assignOrder.isLoading ? 'Taking…' : 'Take order'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
