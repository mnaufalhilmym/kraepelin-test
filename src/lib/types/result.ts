export type ResultColumn = {
	id: string;
	question: string;
	userAns?: number;
	isCorrect: boolean;
	correctAnsString: string;
}[] & { correctAns?: number; wrongAns?: number };
