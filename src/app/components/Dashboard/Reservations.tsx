import { useState } from 'react';
import { Calendar, Clock, Users, Plus } from 'lucide-react';

export function Reservations() {
  const [reservations] = useState([
    { id: 1, name: 'Abebe Kebede', guests: 4, date: '2026-05-08', time: '18:00', table: 'Table 12', phone: '+251 91 XXX XXXX', status: 'confirmed' },
    { id: 2, name: 'Sara Mohammed', guests: 2, date: '2026-05-08', time: '19:30', table: 'Table 5', phone: '+251 92 XXX XXXX', status: 'confirmed' },
    { id: 3, name: 'Daniel Tesfaye', guests: 6, date: '2026-05-09', time: '13:00', table: 'Table 20', phone: '+251 93 XXX XXXX', status: 'pending' },
    { id: 4, name: 'Meron Alemu', guests: 3, date: '2026-05-09', time: '20:00', table: 'Table 8', phone: '+251 94 XXX XXXX', status: 'confirmed' },
    { id: 5, name: 'Yonas Haile', guests: 8, date: '2026-05-10', time: '19:00', table: 'Table 25', phone: '+251 95 XXX XXXX', status: 'pending' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservations</h1>
          <p className="text-gray-500">Manage table bookings and reservations</p>
        </div>
        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-xl transition-all duration-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Today's Reservations</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">32</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Pending</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Reservations</h3>
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-indigo-200 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{reservation.name}</h4>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      reservation.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {reservation.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      {reservation.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 text-indigo-500" />
                      {reservation.guests} guests
                    </div>
                    <div className="text-gray-600">
                      {reservation.table}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">{reservation.phone}</p>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
