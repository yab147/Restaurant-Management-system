import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Tags } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMenuItems, useMenuCategories, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, useToggleMenuAvailability, useCreateMenuCategory } from '../hooks/useMenu.js';
import { useMenuStore }  from '../store/useMenuStore.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS }   from '../../../permissions/matrix.js';
import Badge             from '../../../shared/components/ui/Badge.jsx';
import Modal             from '../../../shared/components/ui/Modal.jsx';
import Spinner           from '../../../shared/components/ui/Spinner.jsx';

const EMPTY_FORM = { name: '', description: '', price: '', categoryId: '', availability: true, imageUrl: '' };
const EMPTY_CATEGORY_FORM = { name: '', description: '', icon: '' };

export default function MenuPage() {
  const { hasPermission } = usePermission();
  const { filters, setFilters, selectedCategory, setSelectedCategory, editingItem, setEditingItem } = useMenuStore();

  const { data: items = [],      isLoading }  = useMenuItems();
  const { data: categories = [] }             = useMenuCategories();
  const createItem    = useCreateMenuItem();
  const updateItem    = useUpdateMenuItem();
  const deleteItem    = useDeleteMenuItem();
  const toggleAvail   = useToggleMenuAvailability();
  const createCategory = useCreateMenuCategory();

  const canCreate = hasPermission(PERMISSIONS.MENU_CREATE);
  const canEdit   = hasPermission(PERMISSIONS.MENU_EDIT);
  const canDelete = hasPermission(PERMISSIONS.MENU_DELETE);

  const [form, setForm] = useState(EMPTY_FORM);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const filtered = useMemo(() => {
    let list = [...items];
    if (selectedCategory !== 'all') list = list.filter(i => i.categoryId === Number(selectedCategory));
    if (filters.search) list = list.filter(i => i.name?.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.available === 'available') list = list.filter(i => Boolean(i.availability));
    if (filters.available === 'unavailable') list = list.filter(i => !Boolean(i.availability));
    if (filters.spicy === 'spicy') list = list.filter(i => Boolean(i.isSpicy));
    if (filters.popular === 'popular') list = list.filter(i => Boolean(i.isPopular));
    if (filters.sort === 'price-low') list.sort((a, b) => Number(a.price) - Number(b.price));
    if (filters.sort === 'price-high') list.sort((a, b) => Number(b.price) - Number(a.price));
    if (filters.sort === 'name') list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return list;
  }, [items, selectedCategory, filters.search, filters.available, filters.spicy, filters.popular, filters.sort]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingItem({}); };
  const openEdit   = (item) => { setForm({ name: item.name, description: item.description, price: item.price, categoryId: item.categoryId, availability: item.availability, imageUrl: item.imageUrl || '' }); setEditingItem(item); };

  const handleSave = () => {
    const payload = { ...form, price: Number(form.price), categoryId: Number(form.categoryId) };
    if (editingItem?.itemId) {
      updateItem.mutate({ id: editingItem.itemId, ...payload }, {
        onSuccess: () => { setEditingItem(null); toast.success('Menu item updated'); },
        onError:   () => toast.error('Failed to update item'),
      });
    } else {
      createItem.mutate(payload, {
        onSuccess: () => { setEditingItem(null); toast.success('Menu item created'); },
        onError:   () => toast.error('Failed to create item'),
      });
    }
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this menu item?')) return;
    deleteItem.mutate(id, {
      onSuccess: () => toast.success('Item deleted'),
      onError:   () => toast.error('Failed to delete item'),
    });
  };

  const handleCreateCategory = () => {
    if (!categoryForm.name.trim()) return;
    createCategory.mutate(categoryForm, {
      onSuccess: () => {
        setShowCategoryModal(false);
        setCategoryForm(EMPTY_CATEGORY_FORM);
        toast.success('Category created');
      },
      onError: () => toast.error('Failed to create category'),
    });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Menu</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>{filtered.length} items</p>
        </div>
        {canCreate && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
              style={{ background: '#F0E8DE', color: '#8B3A0F' }}>
              <Tags size={16} /> Add Category
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
              <Plus size={16} /> Add Item
            </button>
          </div>
        )}
      </div>

      {/* Category tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1" style={{ background: 'white', border: '1px solid #E8D5C0' }}>
          <Search size={15} style={{ color: '#8B6E52' }} />
          <input value={filters.search || ''} onChange={e => setFilters({ search: e.target.value })}
            placeholder="Search menu..." className="bg-transparent text-sm outline-none flex-1" style={{ color: '#2C1810' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ categoryId: 'all', name: 'All' }, ...categories].map(cat => (
            <button key={cat.categoryId ?? 'all'} onClick={() => setSelectedCategory(String(cat.categoryId))}
              className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
              style={selectedCategory === String(cat.categoryId)
                ? { background: '#C8862A', color: 'white' }
                : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={filters.available || 'all'} onChange={e => setFilters({ available: e.target.value })}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
          style={{ background: 'white', color: '#6B4F3A', border: '1px solid #E8D5C0' }}>
          <option value="all">All availability</option>
          <option value="available">Available only</option>
          <option value="unavailable">Unavailable only</option>
        </select>
        <select value={filters.spicy || 'all'} onChange={e => setFilters({ spicy: e.target.value })}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
          style={{ background: 'white', color: '#6B4F3A', border: '1px solid #E8D5C0' }}>
          <option value="all">All spice</option>
          <option value="spicy">Spicy only</option>
        </select>
        <select value={filters.popular || 'all'} onChange={e => setFilters({ popular: e.target.value })}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
          style={{ background: 'white', color: '#6B4F3A', border: '1px solid #E8D5C0' }}>
          <option value="all">All popularity</option>
          <option value="popular">Popular only</option>
        </select>
        <select value={filters.sort || 'name'} onChange={e => setFilters({ sort: e.target.value })}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
          style={{ background: 'white', color: '#6B4F3A', border: '1px solid #E8D5C0' }}>
          <option value="name">Sort by name</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.itemId} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              style={{ background: 'white', border: '1px solid #F0E8DE' }}>
              <div className="h-36 flex items-center justify-center text-4xl" style={{ background: '#F8F0E8' }}>
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : '🍽️'}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-sm" style={{ color: '#2C1810' }}>{item.name}</h3>
                  <Badge status={item.availability ? 'active' : 'inactive'} label={item.availability ? 'Available' : 'Unavailable'} size="sm" />
                </div>
                <p className="text-xs mb-2 line-clamp-2" style={{ color: '#8B6E52' }}>{item.description}</p>
                <p className="font-black" style={{ color: '#C8862A' }}>ETB {item.price}</p>
                {(canEdit || canDelete) && (
                  <div className="flex gap-2 mt-3">
                    {canEdit && (
                      <>
                        <button onClick={() => toggleAvail.mutate({ id: item.itemId, availability: !item.availability })}
                          className="p-2 rounded-lg hover:bg-amber-50 transition-colors" style={{ color: '#8B6E52' }} title="Toggle availability">
                          {item.availability ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => openEdit(item)}
                          className="p-2 rounded-lg hover:bg-amber-50 transition-colors" style={{ color: '#0369A1' }}>
                          <Edit2 size={14} />
                        </button>
                      </>
                    )}
                    {canDelete && (
                      <button onClick={() => handleDelete(item.itemId)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors ml-auto" style={{ color: '#DC2626' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)}
        title={editingItem?.itemId ? 'Edit Menu Item' : 'Add Menu Item'} size="md"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setEditingItem(null)} className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
            <button onClick={handleSave} disabled={createItem.isPending || updateItem.isPending}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>
              {createItem.isPending || updateItem.isPending ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        }>
        <div className="space-y-4">
          {[{ key: 'name', label: 'Name', placeholder: 'Item name' }, { key: 'description', label: 'Description', placeholder: 'Description' }, { key: 'price', label: 'Price (ETB)', placeholder: '0.00', type: 'number' }].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>{f.label}</label>
              <input type={f.type || 'text'} value={form[f.key]} placeholder={f.placeholder}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Category</label>
            <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)}
        title="Add Menu Category" size="sm"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowCategoryModal(false)} className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
            <button onClick={handleCreateCategory} disabled={createCategory.isPending}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>
              {createCategory.isPending ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        }>
        <div className="space-y-4">
          {[
            { key: 'name', label: 'Category Name', placeholder: 'e.g. Breakfast' },
            { key: 'description', label: 'Description', placeholder: 'Short description' },
            { key: 'icon', label: 'Icon Label', placeholder: 'e.g. coffee' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>{f.label}</label>
              <input value={categoryForm[f.key]} placeholder={f.placeholder}
                onChange={e => setCategoryForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
