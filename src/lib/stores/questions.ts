import type { Question } from '$lib/types/question';
import { writable } from 'svelte/store';

function questionsStore() {
	const { subscribe, set, update } = writable<Question[][]>();

	return {
		subscribe,
		newColumn: (n: number) => {
			update((prev) => {
				const append: Question[] = [];
				for (let i = 0; i < n; ++i) {
					append.push({
						id: Math.random().toString(),
						number1: Math.floor(Math.random() * 10),
						number2: Math.floor(Math.random() * 10)
					});
				}
				return prev ? [...prev, append] : [append];
			});
		},
		appendColumn: (col: number, n: number) => {
			update((prev) => {
				if (col > prev.length - 1) {
					return prev;
				}
				const append: Question[] = [];
				for (let i = 0; i < n; ++i) {
					append.push({
						id: Math.random().toString(),
						number1: Math.floor(Math.random() * 10),
						number2: Math.floor(Math.random() * 10)
					});
				}
				const old = [...prev];
				old[col] = [...old[col], ...append];
				return old;
			});
		},
		setUserAnswer: (col: number, index: number, ans: number | undefined) => {
			update((prev) => {
				const q = [...prev];
				q[col][index].userAnswer = ans;
				return q;
			});
		},
		reset: () => set([])
	};
}

export const questions = questionsStore();
