import { type FormEvent, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  available: boolean;
  description: string;
}

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Kitfo', category: 'Main Course', price: '500 ETB', available: true, description: 'Traditional Ethiopian minced raw beef' },
    { id: 2, name: 'Doro Wat', category: 'Main Course', price: '450 ETB', available: true, description: 'Spicy chicken stew with injera' },
    { id: 3, name: 'Tibs', category: 'Main Course', price: '600 ETB', available: true, description: 'Sautéed meat with vegetables' },
    { id: 4, name: 'Shiro', category: 'Vegetarian', price: '300 ETB', available: true, description: 'Chickpea flour stew' },
    { id: 5, name: 'Ethiopian Coffee', category: 'Beverages', price: '50 ETB', available: true, description: 'Traditional ceremony coffee' },
    { id: 6, name: 'Tej', category: 'Beverages', price: '150 ETB', available: true, description: 'Honey wine' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formItem, setFormItem] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    description: '',
  });

  const toggleAvailability = (id: number) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    const matchesSearch = `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setFormItem({ name: '', category: 'Main Course', price: '', description: '' });
    setEditingItem(null);
    setShowAddModal(false);
  };

  const openCreateModal = () => {
    setFormItem({ name: '', category: 'Main Course', price: '', description: '' });
    setEditingItem(null);
    setShowAddModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setFormItem({
      name: item.name,
      category: item.category,
      price: item.price.replace(' ETB', ''),
      description: item.description,
    });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const saveMenuItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const savedItem = {
      name: formItem.name,
      category: formItem.category,
      price: `${formItem.price} ETB`,
      description: formItem.description,
    };

    if (editingItem) {
      setMenuItems(menuItems.map((item) => (
        item.id === editingItem.id ? { ...item, ...savedItem } : item
      )));
    } else {
      setMenuItems([
        ...menuItems,
        {
          id: Date.now(),
          available: true,
          ...savedItem,
        },
      ]);
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h1>
          <p className="text-gray-500">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
          >
            <option>All Categories</option>
            <option>Main Course</option>
            <option>Vegetarian</option>
            <option>Beverages</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-indigo-600 font-medium">{item.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setMenuItems(menuItems.filter((menuItem) => menuItem.id !== item.id))}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{item.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xl font-bold text-gray-900">{item.price}</span>
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.available
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredItems.length === 0 && (
          <p className="py-10 text-center text-gray-500">No menu items match your filters.</p>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <form onSubmit={saveMenuItem} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Item Name"
                  value={formItem.name}
                  onChange={(event) => setFormItem({ ...formItem, name: event.target.value })}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <select
                  value={formItem.category}
                  onChange={(event) => setFormItem({ ...formItem, category: event.target.value })}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                >
                  <option>Main Course</option>
                  <option>Vegetarian</option>
                  <option>Beverages</option>
                  <option>Dessert</option>
                </select>
              </div>
              <input
                required
                min="1"
                type="number"
                placeholder="Price (ETB)"
                value={formItem.price}
                onChange={(event) => setFormItem({ ...formItem, price: event.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <textarea
                required
                placeholder="Description"
                rows={4}
                value={formItem.description}
                onChange={(event) => setFormItem({ ...formItem, description: event.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              ></textarea>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 font-medium"
                >
                  {editingItem ? 'Save Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
