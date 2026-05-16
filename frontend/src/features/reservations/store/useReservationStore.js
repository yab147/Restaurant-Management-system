import { create } from 'zustand';
import { immer }  from 'zustand/middleware/immer';

export const useReservationStore = create(immer(set => ({
  filters: { search: '', status: 'all', date: null },
  setFilters: f => set(s => { s.filters = { ...s.filters, ...f }; }),
  resetFilters: () => set(s => { s.filters = { search: '', status: 'all', date: null }; }),

  editingReservation: null,
  setEditingReservation: v => set(s => { s.editingReservation = v; }),
})));
