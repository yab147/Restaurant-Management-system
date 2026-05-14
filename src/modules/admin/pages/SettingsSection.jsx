import React from 'react';

const SettingsSection = () => {
  const settings = [
    { label: 'Restaurant Name', value: 'Holy Restaurant' },
    { label: 'Location', value: 'Kezira Area, Dire Dawa, Ethiopia' },
    { label: 'Phone', value: '+251 25 111 2345' },
    { label: 'Currency', value: 'ETB (Ethiopian Birr)' },
    { label: 'Opening Hours', value: '6:30 AM – 10:30 PM' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-black mb-6" style={{
        color: 'var(--bg-dark-accent)',
        fontFamily: "'Playfair Display', serif"
      }}>Settings</h2>
      <div className="max-w-xl space-y-4">
        {settings.map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{
            background: 'white',
            border: '1px solid #F0E8DE'
          }}>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{
              color: 'var(--text-brown-muted)'
            }}>{s.label}</label>
            <input defaultValue={s.value} className="w-full text-sm outline-none" style={{
              color: 'var(--bg-dark-accent)',
              background: 'transparent'
            }} />
          </div>
        ))}
        <button className="px-6 py-3 rounded-xl text-sm font-semibold" style={{
          background: 'var(--primary-gradient)',
          color: 'white'
        }}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;
