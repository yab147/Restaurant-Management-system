import { create } from 'zustand';
import { immer }  from 'zustand/middleware/immer';

export const usePaymentStore = create(immer(set => ({
  filters: { search: '', status: 'all', startDate: null, endDate: null },
  setFilters: f => set(s => { s.filters = { ...s.filters, ...f }; }),
  resetFilters: () => set(s => { s.filters = { search: '', status: 'all', startDate: null, endDate: null }; }),

  selectedPaymentId: null,
  setSelectedPaymentId: v => set(s => { s.selectedPaymentId = v; }),
})));
