export interface Quiz {
    _id: string;
    title: string;
    category: {
        name: string;
    };
    difficulty: {
        name: string;
    };
    description: string;
    timeLimit?: number;
    passingScore?: number;
    status: string;
    settings?: {
        showAnswers: boolean;
        publicLeaderboard: boolean;
    };
    createdBy: string;
    questions: string[];
    createdAt: string;
}