import React from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, Bell, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider.jsx';
import { ROUTES } from '../../../constants/routes.js';

const ROLE_TASK_INFO = {
  admin: {
    title: 'System Administration',
    color: '#7C3AED',
    focus: 'System stability, security, permission matrices, and user provisioning.',
    tasks: [
      'Provision and manage user accounts and system credentials.',
      'Configure system settings and global operational parameters.',
      'Oversee user roles and security privilege mappings.',
      'Monitor role-based privilege matrices and overall system configurations.',
    ]
  },
  manager: {
    title: 'Operations Management',
    color: '#0369A1',
    focus: 'Operations control, menu management, inventory levels, and sales reporting.',
    tasks: [
      'Manage menu categories, items, prices, and specifications.',
      'Oversee restaurant table configurations, capacities, and layout settings.',
      'Monitor inventory stock levels, restock ingredients, and track consumption.',
      'Track sales payments, process refunds, and export analytical operations reports.',
    ]
  },
  waiter: {
    title: 'Dining Service & Station',
    color: '#059669',
    focus: 'Table service, capturing customer orders, and managing table states.',
    tasks: [
      'Capture customer orders, configure details, and manage takeaway/dine-in selections.',
      'Monitor assigned order workflow states (confirmed, preparing, ready to serve).',
      'Cycle table operational statuses in real-time (available, occupied, cleaning).',
      'Provide exceptional service at customer dining stations.',
    ]
  },
  chef: {
    title: 'Kitchen & Culinary Operations',
    color: '#D97706',
    focus: 'Order queue progression, ticket timing, and ingredient monitoring.',
    tasks: [
      'Track incoming kitchen order queue in real-time.',
      'Advance active orders through confirmed → preparing → ready status.',
      'Monitor ingredient stock levels and inventory requirements.',
      'Ensure high standards of culinary quality and speed of service.',
    ]
  },
  cashier: {
    title: 'Transactions & Billing',
    color: '#DC2626',
    focus: 'Billing transactions, processing payments, and customer reservations.',
    tasks: [
      'Allocate and manage dining reservations for incoming guests.',
      'Process order bills, checkout transactions, and customer payments.',
      'Complete served orders and mark transactional status as paid.',
      'Handle cash registers and balance transactional records.',
    ]
  }
};

export default function SettingsPage() {
  const { user } = useAuth();

  const taskInfo = ROLE_TASK_INFO[user?.role] || {
    title: 'General Duties',
    color: '#C8862A',
    focus: 'General restaurant operations and assistance.',
    tasks: [
      'Assist team members with active operational requests.',
      'Maintain restaurant cleanliness and brand representation.',
      'Ensure excellent customer service and hospitality standards.',
    ]
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
            <SettingsIcon size={28} style={{ color: '#C8862A' }} />
            Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8B6E52' }}>Workspace preferences, roles, and duty specifications</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div className="rounded-2xl p-6 space-y-4 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base shadow-sm"
                style={{ background: `linear-gradient(135deg, ${taskInfo.color}, ${taskInfo.color}88)` }}>
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: '#2C1810' }}>{user?.name}</p>
                <p className="text-xs capitalize font-semibold" style={{ color: taskInfo.color }}>{user?.role}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#F0E8DE] space-y-2 text-xs" style={{ color: '#8B6E52' }}>
              <p className="truncate"><span className="font-semibold block mb-0.5" style={{ color: '#2C1810' }}>Email Address</span>{user?.email}</p>
              <p><span className="font-semibold block mb-0.5" style={{ color: '#2C1810' }}>User ID</span>#{user?.userId || user?.id || 'N/A'}</p>
            </div>
          </div>

          {/* Quick Stats/Alert Preferences */}
          <div className="rounded-2xl p-5 shadow-sm space-y-3" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div className="flex gap-3 text-sm">
              <Shield className="mt-0.5 flex-shrink-0" size={18} style={{ color: '#0369A1' }} />
              <div>
                <h3 className="font-bold mb-0.5" style={{ color: '#2C1810' }}>Access Levels</h3>
                <p className="text-[11px]" style={{ color: '#8B6E52' }}>Modules are automatically tailored to your role. Contact an admin for elevated privileges.</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm pt-3 border-t border-[#F0E8DE]">
              <Bell className="mt-0.5 flex-shrink-0" size={18} style={{ color: '#D97706' }} />
              <div>
                <h3 className="font-bold mb-0.5" style={{ color: '#2C1810' }}>Notifications</h3>
                <p className="text-[11px]" style={{ color: '#8B6E52' }}>Real-time topbar alerts are fully custom-filtered and refreshed for your active tasks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task-Based Info Section */}
        <div className="md:col-span-2 rounded-2xl p-6 shadow-sm space-y-5" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: `${taskInfo.color}15`, color: taskInfo.color }}>
              Current Scope
            </span>
            <h2 className="text-xl font-bold mt-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
              {taskInfo.title}
            </h2>
            <p className="text-sm mt-1" style={{ color: '#8B6E52' }}>
              {taskInfo.focus}
            </p>
          </div>

          <div className="border-t border-[#F0E8DE] pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#2C1810' }}>
              Key Responsibilities & Tasks
            </h3>
            <div className="space-y-3">
              {taskInfo.tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl p-3" style={{ background: '#FFFBF5', border: '1px solid #F6EFE6' }}>
                  <CheckCircle2 className="mt-0.5 flex-shrink-0" size={16} style={{ color: taskInfo.color }} />
                  <p className="text-xs font-medium leading-relaxed" style={{ color: '#2C1810' }}>
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-center pt-4" style={{ color: '#8B6E52' }}>
        <Link to={ROUTES.DASHBOARD} className="font-semibold underline hover:opacity-80 transition-colors" style={{ color: '#C8862A' }}>
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
