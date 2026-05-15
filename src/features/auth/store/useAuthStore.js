import { create } from 'zustand';
import { immer }  from 'zustand/middleware/immer';

/** Auth UI store — form loading/error state that should NOT live in AuthProvider */
export const useAuthStore = create(immer(set => ({
  isSubmitting: false,
  setIsSubmitting: v => set(s => { s.isSubmitting = v; }),

  formError: null,
  setFormError: v => set(s => { s.formError = v; }),
  clearFormError: () => set(s => { s.formError = null; }),
})));
