export interface UserResponse {
  _id: string;
  user: string;
  quiz: {
    _id: string;
    title: string;
    category: {
      name: string;
    };
    difficulty: {
      name: string;
    };
  };
  responses: Array<{
    question: {
      question: string;
    };
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
    points: number;
    _id: string;
  }>;
  totalScore: number;
  status: 'started' | 'completed' | 'abandoned';
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
} 