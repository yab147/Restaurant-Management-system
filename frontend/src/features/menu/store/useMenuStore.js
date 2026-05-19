import { create } from 'zustand';
import { immer }  from 'zustand/middleware/immer';

const DEFAULT_FILTERS = {
  search: '',
  categoryId: null,
  available: 'all',
  spicy: 'all',
  popular: 'all',
  sort: 'name',
};

export const useMenuStore = create(immer(set => ({
  filters: { ...DEFAULT_FILTERS },
  setFilters: f => set(s => { s.filters = { ...s.filters, ...f }; }),
  resetFilters: () => set(s => {
    s.filters = { ...DEFAULT_FILTERS };
    s.selectedCategory = 'all';
  }),

  editingItem: null,
  setEditingItem: v => set(s => { s.editingItem = v; }),

  selectedCategory: 'all',
  setSelectedCategory: v => set(s => { s.selectedCategory = v; }),
})));
