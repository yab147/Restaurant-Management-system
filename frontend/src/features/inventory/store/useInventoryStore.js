import { create } from 'zustand';
import { immer }  from 'zustand/middleware/immer';

export const useInventoryStore = create(immer(set => ({
  filters: { search: '', lowStock: false },
  setFilters: f => set(s => { s.filters = { ...s.filters, ...f }; }),
  resetFilters: () => set(s => { s.filters = { search: '', lowStock: false }; }),

  editingItem: null,
  setEditingItem: v => set(s => { s.editingItem = v; }),

  restockItem: null,
  setRestockItem: v => set(s => { s.restockItem = v; }),
})));
