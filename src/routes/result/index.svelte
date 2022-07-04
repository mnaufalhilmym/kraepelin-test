<script lang="ts">
	import { goto } from '$app/navigation';
	import { questions } from '$lib/stores/questions';
	import type { ResultColumn } from '$lib/types/result';
	import { onMount } from 'svelte';

	let isLoading = true;

	const result: ResultColumn[] = [];
	let totalCorrect = 0;
	let totalWrong = 0;

	onMount(() => {
		for (const qs of $questions) {
			const resCol: ResultColumn = [];
			resCol.correctAns = 0;
			resCol.wrongAns = 0;
			for (const q of qs) {
				if (q.userAnswer === undefined) continue;
				const res = q.number1 + q.number2;
				const correctAns = res % 2;
				const isCorrect = correctAns === q.userAnswer;
				resCol.push({
					id: q.id,
					question: q.number1 + ' + ' + q.number2,
					userAns: q.userAnswer,
					isCorrect,
					correctAnsString: `${res} (${correctAns})`
				});
				if (res % 2 === q.userAnswer) {
					++resCol.correctAns!;
					++totalCorrect;
				} else {
					++resCol.wrongAns!;
					++totalWrong;
				}
			}
			result.push(resCol);
		}

		isLoading = false;
	});

	function startTestHandler() {
		questions.reset();
		goto('/');
	}
</script>

<div class="max-w-screen min-h-screen p-8 flex flex-col items-center">
	<header>
		<h1 class="font-bold text-2xl text-center">Kraepelin Test</h1>
	</header>
	<div class="mt-12 mb-4 w-full flex flex-col flex-1">
		<div class="p-2">
			<h2 class="font-bold text-xl text-center">Result</h2>
			<span class="block text-sm text-center">Correct: {totalCorrect} - Wrong: {totalWrong}</span>
		</div>
		<div class="overflow-x-auto">
			<div class="mt-4 mx-auto w-fit gap-x-2 whitespace-nowrap">
				{#if !isLoading}
					{#each result as resCol, index (index)}
						<div class="w-10 inline-flex flex-col-reverse">
							{#each resCol as res (res.id)}
								<div
									title={`Question: ${res.question}\nYour answer: ${res.userAns}\nCorrect answer: ${res.correctAnsString}`}
									class={`h-4 ${res.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} border`}
								/>
							{/each}
							<span class="block text-xs text-center">{resCol.correctAns} - {resCol.wrongAns}</span>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<div>
		<button
			type="button"
			on:click={startTestHandler}
			class="px-8 py-2 bg-sky-500 text-white rounded-xl">Restart Test</button
		>
	</div>
</div>
