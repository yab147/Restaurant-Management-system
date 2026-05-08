import { Users, UserCheck, Clock } from 'lucide-react';

export function Staff() {
  const staff = [
    { id: 1, name: 'Alemayehu Negash', role: 'Head Chef', status: 'On Duty', shift: '8:00 AM - 4:00 PM', phone: '+251 91 XXX XXXX' },
    { id: 2, name: 'Tigist Bekele', role: 'Sous Chef', status: 'On Duty', shift: '8:00 AM - 4:00 PM', phone: '+251 92 XXX XXXX' },
    { id: 3, name: 'Dawit Mulugeta', role: 'Waiter', status: 'On Duty', shift: '10:00 AM - 6:00 PM', phone: '+251 93 XXX XXXX' },
    { id: 4, name: 'Bethlehem Tadesse', role: 'Waitress', status: 'On Duty', shift: '10:00 AM - 6:00 PM', phone: '+251 94 XXX XXXX' },
    { id: 5, name: 'Yohannes Girma', role: 'Bartender', status: 'Off Duty', shift: '4:00 PM - 12:00 AM', phone: '+251 95 XXX XXXX' },
    { id: 6, name: 'Selam Desta', role: 'Host', status: 'On Duty', shift: '9:00 AM - 5:00 PM', phone: '+251 96 XXX XXXX' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
        <p className="text-gray-500">Manage your restaurant staff and schedules</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">On Duty</p>
              <p className="text-2xl font-bold text-gray-900">{staff.filter(s => s.status === 'On Duty').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Off Duty</p>
              <p className="text-2xl font-bold text-gray-900">{staff.filter(s => s.status === 'Off Duty').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Staff Directory</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {staff.map((member) => (
            <div key={member.id} className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-indigo-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-sm font-medium text-indigo-600">{member.role}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  member.status === 'On Duty'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {member.shift}
                </div>
                <p className="text-gray-500">{member.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
