import { create } from 'zustand';

export const useCounterSore = create((set) => ({
	// The state + initial value
	count: 0,

	// The Actions (Functions describe how to modify state)

	reset: () => set(() => ({ count: 0 })),

	// set take a callback, and the param represent current state
	increment: () => set((state) => ({ count: state.count + 1 })),

	decrement: () => set((state) => ({ count: state.count - 1 })),
}));
