import { useState } from 'react';
import { PackageSearch, AlertTriangle, Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Ingredient } from '../../../types';

// Mock Data
const MOCK_INVENTORY: Ingredient[] = [
  { ingredientId: 1, name: 'Tomato Sauce', quantity: 15, unit: 'Liters', threshold: 10 },
  { ingredientId: 2, name: 'Pizza Dough', quantity: 8, unit: 'KG', threshold: 15 },
  { ingredientId: 3, name: 'Mozzarella Cheese', quantity: 20, unit: 'KG', threshold: 10 },
  { ingredientId: 4, name: 'Fresh Basil', quantity: 2, unit: 'KG', threshold: 5 },
  { ingredientId: 5, name: 'Olive Oil', quantity: 25, unit: 'Liters', threshold: 5 },
];

export function Inventory() {
  const [inventory, setInventory] = useState<Ingredient[]>(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.quantity <= item.threshold);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your restaurant's stock</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-800">Low Stock Alerts</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item.ingredientId} className="px-3 py-1 bg-white text-red-700 text-sm rounded-full border border-red-200">
                {item.name} ({item.quantity} {item.unit} left)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="p-4 font-medium">Item Name</th>
                <th className="p-4 font-medium">Stock Level</th>
                <th className="p-4 font-medium">Threshold</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const isLow = item.quantity <= item.threshold;
                return (
                  <tr key={item.ingredientId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{item.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900">{item.quantity} <span className="text-gray-500 text-sm">{item.unit}</span></p>
                    </td>
                    <td className="p-4 text-gray-500">
                      {item.threshold} {item.unit}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isLow ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <ArrowDownRight className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
