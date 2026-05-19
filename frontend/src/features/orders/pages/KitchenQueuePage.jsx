/**
 * KitchenQueuePage — Chef-focused order board
 *
 * Shows confirmed / preparing / ready columns with one-click status advances.
 * Uses ORDERS_QUEUE_MANAGE permission (chef + manager).
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Spinner from '../../../shared/components/ui/Spinner.jsx';
import {
  KITCHEN_QUEUE_STATUSES,
  ORDER_STATUS_LABELS,
  getAdvanceableNextStatus,
  formatOrderId,
} from '../utils/orderUtils.js';

const COLUMN_META = {
  confirmed: { title: 'Confirmed', subtitle: 'Start cooking', color: '#0369A1' },
  preparing: { title: 'Preparing', subtitle: 'In the kitchen', color: '#D97706' },
  ready:     { title: 'Ready', subtitle: 'Ready for pickup', color: '#059669' },
};

export default function KitchenQueuePage() {
  const { hasPermission } = usePermission();
  const { data: orders = [], isLoading, isFetching, refetch } = useOrders(
    {},
    { refetchInterval: 30_000 },
  );
  const updateStatus = useUpdateOrderStatus();

  if (!hasPermission(PERMISSIONS.ORDERS_QUEUE_MANAGE)) {
    return (
      <div className="p-6 text-center" style={{ color: '#8B6E52' }}>
        You do not have access to the kitchen queue.
      </div>
    );
  }

  const kitchenOrders = (orders || []).filter(o =>
    KITCHEN_QUEUE_STATUSES.includes(o.status),
  );

  const handleAdvance = (orderId, status) => {
    updateStatus.mutate({ orderId, status });
  };

  const columns = KITCHEN_QUEUE_STATUSES.map(status => ({
    status,
    orders: kitchenOrders.filter(o => o.status === status),
    ...COLUMN_META[status],
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
            Kitchen Queue
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8B6E52' }}>
            Move orders through confirmed → preparing → ready
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#F0E8DE', color: '#8B3A0F' }}
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {columns.map(col => (
            <div key={col.status} className="rounded-2xl p-4" style={{ background: '#FDF6EE', border: '1px solid #F0E8DE' }}>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm uppercase tracking-wide" style={{ color: col.color }}>
                    {col.title}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${col.color}20`, color: col.color }}>
                    {col.orders.length}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#8B6E52' }}>{col.subtitle}</p>
              </div>

              <div className="space-y-3 min-h-[120px]">
                {col.orders.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: '#8B6E52' }}>No orders</p>
                ) : col.orders.map(order => {
                  const nextStatus = getAdvanceableNextStatus(order.status, {
                    canEdit: false,
                    canQueueManage: true,
                  });
                  return (
                    <div
                      key={order.orderId}
                      className="rounded-xl p-4 shadow-sm"
                      style={{ background: 'white', border: '1px solid #F0E8DE' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-black text-sm" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
                          {formatOrderId(order.orderId)}
                        </span>
                        <Badge status={order.status} label={ORDER_STATUS_LABELS[order.status]} />
                      </div>
                      <p className="font-semibold text-sm mb-1" style={{ color: '#2C1810' }}>{order.customerName}</p>
                      <p className="text-xs mb-3" style={{ color: '#8B6E52' }}>
                        {order.tableNumber ? `Table ${order.tableNumber}` : order.type}
                        {' · '}
                        {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {order.items?.map(item => (
                          <span key={item.orderItemId} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: '#F5E6D3', color: '#8B6E52' }}>
                            {item.quantity}× {item.itemName}
                          </span>
                        ))}
                      </div>
                      {nextStatus && (
                        <button
                          type="button"
                          disabled={updateStatus.isPending}
                          onClick={() => handleAdvance(order.orderId, nextStatus)}
                          className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                          style={{ background: `linear-gradient(135deg, ${col.color}, #8B3A0F)` }}
                        >
                          {updateStatus.isPending ? 'Updating…' : `→ Mark as ${ORDER_STATUS_LABELS[nextStatus] || nextStatus}`}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
