import { Save } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Settings</h1>
        <p className="text-gray-500">Configure your restaurant preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Restaurant Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">Restaurant Name</label>
              <input
                type="text"
                defaultValue="Holy Restaurant"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">Location</label>
              <input
                type="text"
                defaultValue="Downtown Dire Dawa, Near Kezira Market"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">Phone Number</label>
              <input
                type="text"
                defaultValue="+251 25 XXX XXXX"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">Email</label>
              <input
                type="email"
                defaultValue="info@holyrestaurant.et"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Operating Hours</h3>
          <div className="space-y-4">
            {[
              { day: 'Monday - Friday', hours: '6:00 AM - 9:00 PM' },
              { day: 'Saturday - Sunday', hours: '7:00 AM - 10:00 PM' },
            ].map((schedule, idx) => (
              <div key={idx}>
                <label className="block text-sm font-semibold text-gray-500 mb-2">{schedule.day}</label>
                <input
                  type="text"
                  defaultValue={schedule.hours}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Table Configuration</h4>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">Total Tables</label>
              <input
                type="number"
                defaultValue="25"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { label: 'New Order Notifications', description: 'Get notified when a new order is placed' },
            { label: 'Reservation Alerts', description: 'Receive alerts for new reservations' },
            { label: 'Low Stock Warnings', description: 'Get warned when inventory is running low' },
            { label: 'Daily Reports', description: 'Receive end-of-day summary reports' },
          ].map((pref, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-semibold text-gray-900 mb-1">{pref.label}</p>
                <p className="text-sm text-gray-500">{pref.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-xl transition-all duration-300 flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
