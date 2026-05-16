import { create } from 'zustand';
import { immer }  from 'zustand/middleware/immer';

export const useMenuStore = create(immer(set => ({
  // UI filters
  filters: { search: '', categoryId: null, available: null },
  setFilters: f => set(s => { s.filters = { ...s.filters, ...f }; }),
  resetFilters: () => set(s => { s.filters = { search: '', categoryId: null, available: null }; }),

  // Modal state
  editingItem: null,        // null = closed, {} = create, {...} = edit
  setEditingItem: v => set(s => { s.editingItem = v; }),

  // Selected category tab
  selectedCategory: 'all',
  setSelectedCategory: v => set(s => { s.selectedCategory = v; }),
})));
