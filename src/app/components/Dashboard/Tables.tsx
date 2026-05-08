import { useState } from 'react';
import { Grid3X3, Users, Edit2, CheckCircle2, Clock } from 'lucide-react';
import { Table, TableStatus } from '../../../types';

// Mock Data
const MOCK_TABLES: Table[] = [
  { tableId: 1, number: 'T1', capacity: 2, status: TableStatus.Available },
  { tableId: 2, number: 'T2', capacity: 4, status: TableStatus.Occupied },
  { tableId: 3, number: 'T3', capacity: 4, status: TableStatus.Reserved },
  { tableId: 4, number: 'T4', capacity: 6, status: TableStatus.Available },
  { tableId: 5, number: 'T5', capacity: 2, status: TableStatus.Occupied },
  { tableId: 6, number: 'T6', capacity: 8, status: TableStatus.Available },
];

export function Tables() {
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
  
  const getStatusColor = (status: TableStatus) => {
    switch(status) {
      case TableStatus.Available: return 'bg-green-100 text-green-800 border-green-200';
      case TableStatus.Occupied: return 'bg-orange-100 text-orange-800 border-orange-200';
      case TableStatus.Reserved: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: TableStatus) => {
    switch(status) {
      case TableStatus.Available: return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case TableStatus.Occupied: return <Users className="w-4 h-4 text-orange-600" />;
      case TableStatus.Reserved: return <Clock className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  const toggleStatus = (tableId: number) => {
    setTables(tables.map(t => {
      if (t.tableId === tableId) {
        const nextStatus = 
          t.status === TableStatus.Available ? TableStatus.Occupied :
          t.status === TableStatus.Occupied ? TableStatus.Available :
          TableStatus.Available; // simplified toggle
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage restaurant seating and availability</p>
        </div>
        <div className="flex gap-2">
          {Object.values(TableStatus).map(status => (
            <div key={status} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${
                status === TableStatus.Available ? 'bg-green-500' :
                status === TableStatus.Occupied ? 'bg-orange-500' : 'bg-blue-500'
              }`} />
              <span className="text-gray-700">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables.map(table => (
          <div 
            key={table.tableId} 
            className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
              table.status === TableStatus.Available ? 'border-green-200 bg-green-50 hover:border-green-300' :
              table.status === TableStatus.Occupied ? 'border-orange-200 bg-orange-50 hover:border-orange-300' :
              'border-blue-200 bg-blue-50 hover:border-blue-300'
            }`}
            onClick={() => toggleStatus(table.tableId)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                <span className="font-bold text-gray-900">{table.number}</span>
              </div>
              <div className="p-1.5 bg-white rounded-full shadow-sm">
                {getStatusIcon(table.status)}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{table.capacity}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); /* Handle edit */ }}
                className="p-1.5 text-gray-400 hover:text-gray-900 bg-white rounded-md shadow-sm transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
