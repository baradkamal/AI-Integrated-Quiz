export interface AdvanceQuiz {
    _id: string;
    title: string;
    category: {
        name: string;
    };
    difficulty: {
        name: string;
    };
    timeLimit: number;
    description: string;
    passingScore: number;
    status: string;
    createdBy: string | null;
    questions: Array<{
        _id: string;
        type: string;
        question: string;
        correct_answer: string;
        incorrect_answers: string[];
    }>;
    createdAt: string;
    __v: number;
}

export interface UserResponse {
    quizId: string;
    userId: string;
    answers: Array<{
        questionId: string;
        selectedAnswer: string;
        isCorrect?: boolean; 
        points?: number; 
    }>;
    score: number;
    status?: 'started' | 'completed' | 'abandoned'; 
}
