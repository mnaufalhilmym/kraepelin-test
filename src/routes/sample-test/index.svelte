<script lang="ts">
	import { goto } from '$app/navigation';

	import { questions } from '$lib/stores/questions';
	import { settings } from '$lib/stores/settings';
	import { ESETTINGS } from '$lib/types/settings';
	import { beforeUpdate, onMount } from 'svelte';

	let isLoading = true;

	let sampleTimer = '..:..';

	let questionsComponents: HTMLElement[] = [];

	onMount(() => {
		if (!$questions || $questions.length === 0) {
			goto('/');
		}

		isLoading = false;

		const initTime = Math.round(Date.now() / 1000);

		const sampleTimeLimit = $settings.sampleTimeLimit.value * $settings.sampleTimeLimit.unit - 1;

		let sampleInitTime = initTime;
		let sampleEndTime = sampleTimeLimit + sampleInitTime;

		const interval = setInterval(() => {
			const now = Math.round(Date.now() / 1000);
			if (now > sampleEndTime) {
				startTestHandler();
			}

			{
				const diffTime = sampleEndTime - now;
				sampleTimer = '';
				let minutes = 0;
				if ($settings.sampleTimeLimit.unit === ESETTINGS.MINUTE) {
					minutes = Math.floor(diffTime / 60);
					sampleTimer = minutes < 10 ? '0' + minutes : minutes + ':';
				}
				const seconds = diffTime - minutes * 60;
				sampleTimer += seconds < 10 ? '0' + seconds : seconds;
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	beforeUpdate(() => {
		if (!$questions) return;
		while (questionsComponents.length < $questions[0].length) {
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

	function startTestHandler() {
		questions.reset();
		questions.newColumn(15);
		goto('/test');
	}
</script>

<div class="max-w-screen h-screen p-8 flex flex-col items-center">
	<header>
		<h1 class="font-bold text-2xl text-center">Kraepelin Test</h1>
	</header>

	<div
		class="mt-12 mb-4 min-h-0 w-full xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl flex flex-col flex-1"
	>
		<div class="p-2 bg-sky-300 rounded-t-xl">
			<h2 class="font-bold text-xl text-center">Sample Test - {sampleTimer}</h2>
		</div>
		<div class="flex-1 border-2 border-sky-300 overflow-y-auto">
			{#if !isLoading && $questions}
				{#each $questions[0] as question, index (question.id)}
					<div bind:this={questionsComponents[index]} class="py-6 flex flex-col items-center">
						<span class="font-bold">Question {index + 1}</span>
						<span class="my-1.5">{question.number1} + {question.number2}</span>
						<div class="space-x-4">
							{#each [0, 1] as ansIndex}
								<button
									type="button"
									on:click={() => answerHandler(0, index, ansIndex)}
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
			on:click={startTestHandler}
			class="px-8 py-2 bg-rose-500 text-white rounded-xl">Start Test</button
		>
	</div>
</div>
