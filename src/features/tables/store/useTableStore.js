import { create } from 'zustand';
import { immer }  from 'zustand/middleware/immer';

export const useTableStore = create(immer(set => ({
  filters: { status: 'all', search: '' },
  setFilters: f => set(s => { s.filters = { ...s.filters, ...f }; }),
  resetFilters: () => set(s => { s.filters = { status: 'all', search: '' }; }),

  editingTable: null,
  setEditingTable: v => set(s => { s.editingTable = v; }),
})));
