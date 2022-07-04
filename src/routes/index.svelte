<script lang="ts">
	import { goto } from '$app/navigation';
	import { settings } from '$lib/stores/settings';
	import { questions } from '$lib/stores/questions';
	import { ESETTINGS } from '$lib/types/settings';

	let kraepelinColumn = 0;

	function changeFormHandler(
		event: Event & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const sampleTimeLimitValue = event.currentTarget['sampleTimeLimitValue'];
		const sampleTimeLimitUnit = event.currentTarget['sampleTimeLimitUnit'];
		const sectionTimeLimitValue = event.currentTarget['sectionTimeLimitValue'];
		const sectionTimeLimitUnit = event.currentTarget['sectionTimeLimitUnit'];
		const incrementNextSectionTimeLimitValue =
			event.currentTarget['incrementNextSectionTimeLimitValue'];
		const incrementNextSectionTimeLimitUnit =
			event.currentTarget['incrementNextSectionTimeLimitUnit'];
		const totalTimeLimitValue = event.currentTarget['totalTimeLimitValue'];
		const totalTimeLimitUnit = event.currentTarget['totalTimeLimitUnit'];

		let isUp = true;

		// changeSampleTimeLimit
		{
			let val = Number(sampleTimeLimitValue.value);
			if ($settings.sampleTimeLimit.unit === ESETTINGS.SECOND && val < 15) {
				val = 15;
			} else if (val < 1) {
				val = 1;
			}
			sampleTimeLimitValue.value = val.toString();
			settings.setSampleTimeLimit({ value: val });
		}

		// changeSampleTimeLimitUnit
		{
			settings.setSampleTimeLimit({ unit: Number(sampleTimeLimitUnit.value) });
		}

		// changeSectionTimeLimit
		{
			let val = Number(sectionTimeLimitValue.value);
			if ($settings.sectionTimeLimit.unit === ESETTINGS.SECOND && val < 15) {
				val = 15;
			} else if (val < 1) {
				val = 1;
			}
			if (val < $settings.sectionTimeLimit.value) {
				isUp = false;
			}
			sectionTimeLimitValue.value = val.toString();
			settings.setSectionTimeLimit({ value: val });
		}

		// changeSectionTimeLimitUnit
		{
			settings.setSectionTimeLimit({ unit: Number(sectionTimeLimitUnit.value) });
		}

		// changeIncrementNextSectionTimeLimit
		{
			let val = Number(incrementNextSectionTimeLimitValue.value);
			if (val < $settings.incrementNextSectionTimeLimit.value) {
				isUp = false;
			}
			settings.setIncrementNextSectionTimeLimit({ value: val });
		}

		// changeIncrementNextSectionTimeLimitUnit
		{
			settings.setIncrementNextSectionTimeLimit({
				unit: Number(incrementNextSectionTimeLimitUnit.value)
			});
		}

		// changeTotalTimeLimit
		{
			let time = $settings.sectionTimeLimit.value * $settings.sectionTimeLimit.unit;
			let beforeTime = time;

			for (
				let index = 1, total = Number(totalTimeLimitValue.value) * $settings.totalTimeLimit.unit;
				time < total;
				++index
			) {
				beforeTime = time;
				time =
					$settings.sectionTimeLimit.value * $settings.sectionTimeLimit.unit * index +
					$settings.incrementNextSectionTimeLimit.value *
						$settings.incrementNextSectionTimeLimit.unit *
						(index - 1);
			}

			let val = beforeTime;

			if (Number(totalTimeLimitValue.value) < $settings.totalTimeLimit.value) {
				isUp = false;
			}

			if (isUp) {
				val = time;
			}

			totalTimeLimitValue.value = (val / $settings.totalTimeLimit.unit).toString();
			settings.setTotalTimeLimit({ value: val / $settings.totalTimeLimit.unit });
		}

		// changeTotalTimeLimitUnit
		{
			settings.setTotalTimeLimit({ unit: Number(totalTimeLimitUnit.value) });
		}
	}

	function resetFormHandler() {
		settings.reset();
	}

	function submitFormHandler() {
		questions.newColumn(15);
		goto('/test');
	}

	$: {
		(() => {
			let index = 1;
			for (
				let time = $settings.sectionTimeLimit.value * $settings.sectionTimeLimit.unit,
					total = $settings.totalTimeLimit.value * $settings.totalTimeLimit.unit;
				time < total;
				++index
			) {
				time =
					$settings.sectionTimeLimit.value * $settings.sectionTimeLimit.unit * index +
					$settings.incrementNextSectionTimeLimit.value *
						$settings.incrementNextSectionTimeLimit.unit *
						(index - 1);
			}
			kraepelinColumn = index > 1 ? index - 1 : index;
		})();
	}
</script>

<div class="min-w-screen min-h-screen p-8 flex flex-col items-center justify-center">
	<header class="mb-6">
		<h1 class="font-bold text-2xl">Kraepelin Test</h1>
	</header>

	<div class="w-full xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-20 sm:px-0">
		<h2 class="mb-4 text-center text-xl">Settings</h2>
		<form
			on:submit|preventDefault={submitFormHandler}
			on:reset|preventDefault={resetFormHandler}
			on:change={changeFormHandler}
			class="flex flex-col gap-y-2"
		>
			<div>
				<label for="sampleTimeLimitValue" class="block">Sample time limit:</label>
				<div class="flex gap-x-2">
					<input
						type="number"
						name="sampleTimeLimitValue"
						value={$settings.sampleTimeLimit.value}
						min="1"
						class="flex-1 px-2 py-1 border rounded-lg outline-none appearance-none"
					/>
					<select
						name="sampleTimeLimitUnit"
						value={$settings.sampleTimeLimit.unit}
						class="inline px-1 rounded-lg"
					>
						<option value={ESETTINGS.SECOND}>seconds</option>
						<option value={ESETTINGS.MINUTE}
							>minute{$settings.sampleTimeLimit.value !== 1 ? 's' : ''}</option
						>
					</select>
				</div>
			</div>
			<div>
				<label for="sectionTimeLimitValue" class="block">Section time limit:</label>
				<div class="flex gap-x-2">
					<input
						type="number"
						name="sectionTimeLimitValue"
						value={$settings.sectionTimeLimit.value}
						min="1"
						class="flex-1 px-2 py-1 border rounded-lg outline-none appearance-none"
					/>
					<select
						name="sectionTimeLimitUnit"
						value={$settings.sectionTimeLimit.unit}
						class="inline px-1 rounded-lg"
					>
						<option value={ESETTINGS.SECOND}>seconds</option>
						<option value={ESETTINGS.MINUTE}
							>minute{$settings.sectionTimeLimit.value !== 1 ? 's' : ''}</option
						>
					</select>
				</div>
			</div>
			<div>
				<label for="incrementNextSectionTimeLimitValue" class="block"
					>Increment next section time limit:</label
				>
				<div class="flex gap-x-2">
					<input
						type="number"
						name="incrementNextSectionTimeLimitValue"
						value={$settings.incrementNextSectionTimeLimit.value}
						min="0"
						class="w-full px-2 py-1 border rounded-lg outline-none appearance-none"
					/>
					<select
						name="incrementNextSectionTimeLimitUnit"
						value={$settings.incrementNextSectionTimeLimit.unit}
						class="inline px-1 rounded-lg"
					>
						<option value={ESETTINGS.SECOND}
							>second{$settings.incrementNextSectionTimeLimit.value > 1 ? 's' : ''}</option
						>
						<option value={ESETTINGS.MINUTE}
							>minute{$settings.incrementNextSectionTimeLimit.value !== 1 &&
							$settings.incrementNextSectionTimeLimit.value !== 0
								? 's'
								: ''}</option
						>
					</select>
				</div>
			</div>
			<div>
				<label for="totalTimeLimitValue" class="block">Total time limit (exclude sample):</label>
				<div class="flex gap-x-2">
					<input
						type="number"
						name="totalTimeLimitValue"
						value={$settings.totalTimeLimit.value}
						step="any"
						min="1"
						class="w-full px-2 py-1 border rounded-lg outline-none appearance-none"
					/>
					<select
						name="totalTimeLimitUnit"
						value={$settings.totalTimeLimit.unit}
						class="inline px-1 rounded-lg"
					>
						<option value={ESETTINGS.MINUTE}
							>minute{$settings.totalTimeLimit.value !== 1 ? 's' : ''}</option
						>
						<option value={ESETTINGS.HOUR}
							>hour{$settings.totalTimeLimit.value !== 1 ? 's' : ''}</option
						>
					</select>
				</div>
			</div>
			<div class="mt-2">
				<span
					>There will be 1 sample and {kraepelinColumn} test column{kraepelinColumn > 1 ? 's' : ''} on
					the Kraepelin test sheet.</span
				>
			</div>
			<div class="mt-4 mx-auto space-x-6">
				<button type="reset" class="w-20 h-10 bg-rose-500 font-bold text-white rounded-xl"
					>Reset</button
				>
				<button type="submit" class="w-20 h-10 bg-sky-500 font-bold text-white rounded-xl"
					>Start</button
				>
			</div>
		</form>
	</div>
</div>
