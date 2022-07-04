import { writable } from 'svelte/store';
import { ESETTINGS } from '../types/settings';

const defaultSettings = {
	sampleTimeLimit: { value: 60, unit: ESETTINGS.SECOND },
	sectionTimeLimit: { value: 30, unit: ESETTINGS.SECOND },
	incrementNextSectionTimeLimit: { value: 10, unit: ESETTINGS.SECOND },
	totalTimeLimit: { value: 30.5, unit: ESETTINGS.MINUTE }
};

function settingsStore() {
	const { subscribe, set, update } = writable(defaultSettings);

	return {
		subscribe,
		setSampleTimeLimit: (data?: { value?: number; unit?: ESETTINGS }) => {
			update((prev) => {
				return {
					...prev,
					sampleTimeLimit: {
						value: data?.value ? data.value : prev.sampleTimeLimit.value,
						unit: data?.unit ? data.unit : prev.sampleTimeLimit.unit
					}
				};
			});
		},
		setSectionTimeLimit: (data: { value?: number; unit?: ESETTINGS }) =>
			update((prev) => {
				return {
					...prev,
					sectionTimeLimit: {
						value: data.value ? data.value : prev.sectionTimeLimit.value,
						unit: data.unit ? data.unit : prev.sectionTimeLimit.unit
					}
				};
			}),
		setIncrementNextSectionTimeLimit: (data: { value?: number; unit?: ESETTINGS }) =>
			update((prev) => {
				return {
					...prev,
					incrementNextSectionTimeLimit: {
						value: data.value ? data.value : prev.incrementNextSectionTimeLimit.value,
						unit: data.unit ? data.unit : prev.incrementNextSectionTimeLimit.unit
					}
				};
			}),
		setTotalTimeLimit: (data: { value?: number; unit?: ESETTINGS }) =>
			update((prev) => {
				return {
					...prev,
					totalTimeLimit: {
						value: data.value ? data.value : prev.totalTimeLimit.value,
						unit: data.unit ? data.unit : prev.totalTimeLimit.unit
					}
				};
			}),
		reset: () => set(defaultSettings)
	};
}

export const settings = settingsStore();
