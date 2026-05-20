import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Tags, Grid, List, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMenuItems, useMenuCategories, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, useToggleMenuAvailability, useCreateMenuCategory } from '../hooks/useMenu.js';
import { useMenuStore } from '../store/useMenuStore.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { useLocalStorage } from '../../../hooks/index.js';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Modal from '../../../shared/components/ui/Modal.jsx';
import Spinner from '../../../shared/components/ui/Spinner.jsx';
import { Link } from 'react-router-dom';
import CustomerModal from '../../../shared/components/modals/CustomerModal.jsx';
const EMPTY_FORM = { name: '', description: '', price: '', categoryId: '', availability: true, imageUrl: '' };
const EMPTY_CATEGORY_FORM = { name: '', description: '', icon: '' };

export default function MenuPage() {
  const { hasPermission } = usePermission();
  const { filters, setFilters, selectedCategory, setSelectedCategory, editingItem, setEditingItem } = useMenuStore();

  const { data: items = [], isLoading } = useMenuItems();
  const { data: categories = [] } = useMenuCategories();
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const toggleAvail = useToggleMenuAvailability();
  const createCategory = useCreateMenuCategory();

  const canCreate = hasPermission(PERMISSIONS.MENU_CREATE);
  const canEdit = hasPermission(PERMISSIONS.MENU_EDIT);
  const canDelete = hasPermission(PERMISSIONS.MENU_DELETE);
  const [menuViewMode, setMenuViewMode] = useLocalStorage('menuViewMode', 'grid');

  const [form, setForm] = useState(EMPTY_FORM);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [orderOpenItem, setOrderOpenItem] = useState(null);
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

  const categoryMap = useMemo(() => categories.reduce((acc, cat) => ({ ...acc, [cat.categoryId]: cat.name }), {}), [categories]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingItem({}); };
  const openEdit = (item) => { setForm({ name: item.name, description: item.description, price: item.price, categoryId: item.categoryId, availability: item.availability, imageUrl: item.imageUrl || '' }); setEditingItem(item); };

  const handleSave = () => {
    const payload = { ...form, price: Number(form.price), categoryId: Number(form.categoryId) };
    if (editingItem?.itemId) {
      updateItem.mutate({ id: editingItem.itemId, ...payload }, {
        onSuccess: () => { setEditingItem(null); toast.success('Menu item updated'); },
        onError: () => toast.error('Failed to update item'),
      });
    } else {
      createItem.mutate(payload, {
        onSuccess: () => { setEditingItem(null); toast.success('Menu item created'); },
        onError: () => toast.error('Failed to create item'),
      });
    }
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this menu item?')) return;
    deleteItem.mutate(id, {
      onSuccess: () => toast.success('Item deleted'),
      onError: () => toast.error('Failed to delete item'),
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

  const renderMenuCard = (item) => (
    <div key={item.itemId} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full bg-white border border-[#F0E8DE]">
      <div className="h-40 flex items-center justify-center text-4xl relative" style={{ background: '#F8F0E8' }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          '🍽️'
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {Boolean(item.isSpicy) && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500 text-white shadow-sm border border-red-400 flex items-center gap-0.5">
              🌶️ Spicy
            </span>
          )}
          {Boolean(item.isPopular) && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500 text-white shadow-sm border border-amber-400 flex items-center gap-0.5">
              ⭐ Popular
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-1.5 gap-2">
          <h3 className="font-bold text-base leading-tight" style={{ color: '#2C1810' }}>{item.name}</h3>
          <Badge status={item.availability ? 'active' : 'inactive'} label={item.availability ? 'Available' : 'Unavailable'} size="sm" />
        </div>
        <p className="text-xs mb-3 line-clamp-2 flex-1" style={{ color: '#8B6E52' }}>{item.description}</p>
        <div className="flex items-baseline justify-between mt-auto pt-2 border-t border-[#F5E6D3]">
          <div>
            <p className="font-black text-lg" style={{ color: '#C8862A' }}>ETB {item.price}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: '#8B6E52' }}>{categoryMap[item.categoryId] || 'Uncategorized'}</p>
          </div>
          {(canEdit || canDelete) && (
            <div className="flex gap-1">
              {canEdit && (
                <>
                  <button onClick={() => toggleAvail.mutate({ id: item.itemId, availability: !item.availability })}
                    className="p-1.5 rounded-lg hover:bg-amber-50 text-[#8B6E52] transition-colors cursor-pointer" title="Toggle availability">
                    {item.availability ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-amber-50 text-[#0369A1] transition-colors cursor-pointer">
                    <Edit2 size={14} />
                  </button>
                </>
              )}
              {canDelete && (
                <button onClick={() => handleDelete(item.itemId)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#DC2626] transition-colors cursor-pointer">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        <div>
            <button className='bg-[#b16c2c] hover:bg-[#703702] hover:cursor-pointer
             px-4 rounded-2xl shadow-2xl text-white font-bold mt-2'
               onClick={() => setOrderOpenItem(item)}>
              Order
            </button>
            <CustomerModal isOpen={!!orderOpenItem} initialItems={orderOpenItem ? [orderOpenItem.itemId] : []} onClose={() => setOrderOpenItem(null)} />
          </div>
      </div>
    </div>
  );

  const renderMenuListRow = (item) => (
    <div key={item.itemId} className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-all bg-white border border-[#F0E8DE] hover:-translate-y-0.5 transition-all duration-300">
      <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr_0.5fr_0.4fr] items-center">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0 flex items-center justify-center rounded-xl text-3xl" style={{ background: '#F8F0E8' }}>
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : '🍽️'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm" style={{ color: '#2C1810' }}>{item.name}</h3>
              {Boolean(item.isSpicy) && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold border border-red-200">🌶️ Spicy</span>
              )}
              {Boolean(item.isPopular) && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-bold border border-amber-200">⭐ Popular</span>
              )}
            </div>
            <p className="text-xs text-[#8B6E52] line-clamp-1">{item.description}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: '#C8862A' }}>ETB {item.price}</p>
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#8B6E52]">{categoryMap[item.categoryId] || 'Uncategorized'}</p>
        </div>
        <div>
          <Badge status={item.availability ? 'active' : 'inactive'} label={item.availability ? 'Available' : 'Unavailable'} size="sm" />
        </div>
        <div className="flex gap-1 justify-end">
          {canEdit && (
            <>
              <button onClick={() => toggleAvail.mutate({ id: item.itemId, availability: !item.availability })}
                className="p-2 rounded-lg hover:bg-amber-50 text-[#8B6E52] transition-colors cursor-pointer" title="Toggle availability">
                {item.availability ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => openEdit(item)}
                className="p-2 rounded-lg hover:bg-amber-50 text-[#0369A1] transition-colors cursor-pointer">
                <Edit2 size={14} />
              </button>
            </>
          )}
          {canDelete && (
            <button onClick={() => handleDelete(item.itemId)}
              className="p-2 rounded-lg hover:bg-red-50 text-[#DC2626] transition-colors cursor-pointer">
              <Trash2 size={14} />
            </button>
          )}
          <div>
            <button className='bg-[#b16c2c] hover:bg-blue-950 hover:cursor-pointer px-4 rounded-2xl shadow-2xl text-white font-bold '
            onClick={() => setOrderOpenItem(item)}
            > Order</button>
             <CustomerModal isOpen={!!orderOpenItem} initialItems={orderOpenItem ? [orderOpenItem.itemId] : []} onClose={() => setOrderOpenItem(null)} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Menu</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>{filtered.length} items</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {canCreate && (
            <>
              <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 cursor-pointer transition-all shadow-sm"
                style={{ background: '#F0E8DE', color: '#8B3A0F' }}>
                <Tags size={16} /> Add Category
              </button>
              <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 cursor-pointer transition-all shadow-sm"
                style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
                <Plus size={16} /> Add Item
              </button>
            </>
          )}
          <div className="flex items-center gap-1 p-1 bg-amber-50/50 rounded-xl border border-amber-100 shadow-inner">
            <button key="grid" onClick={() => setMenuViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${menuViewMode === 'grid' ? 'bg-[#C8862A] text-white shadow-sm' : 'text-[#8B6E52] hover:bg-amber-100/50'}`}
              title="Grid View">
              <Grid size={16} />
            </button>
            <button key="list" onClick={() => setMenuViewMode('list')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${menuViewMode === 'list' ? 'bg-[#C8862A] text-white shadow-sm' : 'text-[#8B6E52] hover:bg-amber-100/50'}`}
              title="List View">
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category & Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input & Advanced Filter Toggle */}
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8D5C0] flex-1 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
            <Search size={16} className="text-[#8B6E52] flex-shrink-0" />
            <input value={filters.search || ''} onChange={e => setFilters({ search: e.target.value })}
              placeholder="Search menu..." className="bg-transparent text-sm outline-none w-full" style={{ color: '#2C1810' }} />
          </div>
          
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border shadow-sm cursor-pointer relative ${
              showAdvancedFilters 
                ? 'bg-amber-50 border-amber-400 text-[#8B3A0F] font-bold' 
                : 'bg-white border-[#E8D5C0] text-[#8B6E52] hover:bg-stone-50'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {(filters.available !== 'all' || filters.spicy !== 'all' || filters.popular !== 'all' || filters.sort !== 'name') && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-600 border-2 border-white animate-pulse" />
            )}
          </button>
        </div>

        {/* Category horizontal scrolling bar */}
        <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar flex-wrap">
          {[{ categoryId: 'all', name: 'All' }, ...categories].map(cat => (
            <button key={cat.categoryId ?? 'all'} onClick={() => setSelectedCategory(String(cat.categoryId))}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 cursor-pointer shadow-sm"
              style={selectedCategory === String(cat.categoryId)
                ? { background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }
                : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Collapsible Drawer */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl border border-amber-100 shadow-inner transition-all duration-300" style={{ background: '#FAF6F0' }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Availability</label>
            <select value={filters.available || 'all'} onChange={e => setFilters({ available: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-white border border-amber-200 text-amber-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-amber-500/20">
              <option value="all">All availability</option>
              <option value="available">Available only</option>
              <option value="unavailable">Unavailable only</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Spice Level</label>
            <select value={filters.spicy || 'all'} onChange={e => setFilters({ spicy: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-white border border-amber-200 text-amber-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-amber-500/20">
              <option value="all">All spice</option>
              <option value="spicy">Spicy only</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Popularity</label>
            <select value={filters.popular || 'all'} onChange={e => setFilters({ popular: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-white border border-amber-200 text-amber-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-amber-500/20">
              <option value="all">All popularity</option>
              <option value="popular">Popular only</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Sort By</label>
            <select value={filters.sort || 'name'} onChange={e => setFilters({ sort: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-white border border-amber-200 text-amber-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-amber-500/20">
              <option value="name">Sort by name</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : menuViewMode === 'list' ? (
        <div className="space-y-4">
          {filtered.map(renderMenuListRow)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(renderMenuCard)}
        </div>
      )}

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)}
        title={editingItem?.itemId ? 'Edit Menu Item' : 'Add Menu Item'} size="md"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setEditingItem(null)} className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer"
              style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
            <button onClick={handleSave} disabled={createItem.isPending || updateItem.isPending}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
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
            <button onClick={() => setShowCategoryModal(false)} className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer"
              style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
            <button onClick={handleCreateCategory} disabled={createCategory.isPending}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
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
