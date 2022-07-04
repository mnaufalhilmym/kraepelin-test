<script lang="ts">
	import { goto } from '$app/navigation';

	import { questions } from '$lib/stores/questions';
	import { settings } from '$lib/stores/settings';
	import { ESETTINGS } from '$lib/types/settings';
	import { beforeUpdate, onMount } from 'svelte';

	let isLoading = true;

	let section = 1;
	let totalTimer = '..:..:..';
	let sectionTimer = '..:..';

	let questionsComponents: HTMLElement[] = [];

	onMount(() => {
		if (!$questions || $questions.length === 0) {
			goto('/');
		}

		isLoading = false;

		const initTime = Math.round(Date.now() / 1000);

		const totalTimeLimit =
			$settings.totalTimeLimit.value * $settings.totalTimeLimit.unit + initTime - 1;
		const sectionTimeLimit = $settings.sectionTimeLimit.value * $settings.sectionTimeLimit.unit - 1;
		const incrementNextSectiomTimeLimit =
			$settings.incrementNextSectionTimeLimit.value * $settings.incrementNextSectionTimeLimit.unit;

		let sectionInitTime = initTime;
		let sectionEndTime = sectionTimeLimit + sectionInitTime;

		const interval = setInterval(() => {
			const now = Math.round(Date.now() / 1000);
			if (now > totalTimeLimit) {
				goto('/result');
				return;
			}
			if (now > sectionEndTime) {
				questions.newColumn(15);
				++section;
				questionsComponents[0].scrollIntoView();
				sectionInitTime = now;
				sectionEndTime =
					sectionTimeLimit + sectionInitTime + incrementNextSectiomTimeLimit * (section - 1);
			}

			{
				const diffTime = totalTimeLimit - now;
				totalTimer = '';
				let hours = 0;
				if ($settings.totalTimeLimit.unit === ESETTINGS.HOUR) {
					hours = Math.floor(diffTime / 3600);
					totalTimer = (hours < 10 ? '0' + hours : hours) + ':';
				}
				const minutes = Math.floor((diffTime - hours * 3600) / 60);
				const seconds = diffTime - (hours * 3600 + minutes * 60);
				totalTimer +=
					(minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
			}

			{
				const diffTime = sectionEndTime - now;
				sectionTimer = '';
				let minutes = 0;
				if ($settings.sectionTimeLimit.unit === ESETTINGS.MINUTE) {
					minutes = Math.floor(diffTime / 60);
					sectionTimer = minutes < 10 ? '0' + minutes : minutes + ':';
				}
				const seconds = diffTime - minutes * 60;
				sectionTimer += seconds < 10 ? '0' + seconds : seconds;
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	beforeUpdate(() => {
		if (!$questions) return;
		while (questionsComponents.length < $questions[section - 1].length) {
			questionsComponents.push({} as HTMLElement);
		}
	});

	function answerHandler(col: number, index: number, ans: number) {
		if ($questions[col][index].userAnswer === ans) {
			questions.setUserAnswer(col, index, undefined);
			return;
		}
		questions.setUserAnswer(col, index, ans);
		if (index > $questions[col].length - 5) {
			questions.appendColumn(col, 5);
		}
		questionsComponents[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	function endTestHandler() {
		goto('/result');
	}
</script>

<div class="max-w-screen h-screen p-8 flex flex-col items-center">
	<header>
		<h1 class="font-bold text-2xl text-center">Kraepelin Test</h1>
		<div class="mt-2 mx-auto w-fit">
			<span>Time left: {totalTimer}</span>
		</div>
	</header>

	<div
		class="mt-12 mb-4 min-h-0 w-full xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl flex flex-col flex-1"
	>
		<div class="p-2 bg-sky-300 rounded-t-xl">
			<h2 class="font-bold text-xl text-center">Column {section} - {sectionTimer}</h2>
		</div>
		<div class="flex-1 border-2 border-sky-300 overflow-y-auto">
			{#if !isLoading && $questions}
				{#each $questions[section - 1] as question, index (question.id)}
					<div bind:this={questionsComponents[index]} class="py-6 flex flex-col items-center">
						<span class="font-bold">Question {index + 1}</span>
						<span class="my-1.5">{question.number1} + {question.number2}</span>
						<div class="space-x-4">
							{#each [0, 1] as ansIndex}
								<button
									type="button"
									on:click={() => answerHandler(section - 1, index, ansIndex)}
									class={`w-10 h-10 ${
										question.userAnswer === ansIndex ? 'bg-sky-300' : 'bg-stone-300'
									} rounded`}>{ansIndex}</button
								>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
	<div>
		<button
			type="button"
			on:click={endTestHandler}
			class="px-8 py-2 bg-rose-500 text-white rounded-xl">End Test</button
		>
	</div>
</div>
