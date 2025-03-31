import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface UserResponse {
  _id: string;
  user: string;
  quiz: string;
  responses: {
    question: string;
    userAnswer: string;
    isCorrect: boolean;
    points: number;
  }[];
  totalScore: number;
  completedAt: string;
  status: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface LeaderboardEntry {
  user: string;
  userName: string;
  totalScore: number;
  completedAt: string;
  percentage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private apiUrl = 'http://localhost:3000/api';
  private userResponseUrl = `${this.apiUrl}/userResponse`;
  private userUrl = `${this.apiUrl}/userbyid`;

  constructor(private http: HttpClient) {}

  getUserResponses(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.userResponseUrl);
  }

  getUserDetails(userId: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }

  getQuizLeaderboard(quizId: string): Observable<LeaderboardEntry[]> {
    return this.getUserResponses().pipe(
      map((responses) => {
        console.log('All responses:', responses);
        const quizAttempts = responses.filter((attempt) => attempt.quiz === quizId);
        console.log('Quiz attempts:', quizAttempts);
        
        const bestScores: { [userId: string]: { totalScore: number; completedAt: string } } = {};
        
        quizAttempts.forEach((attempt) => {
          if (!bestScores[attempt.user] || attempt.totalScore > bestScores[attempt.user].totalScore) {
            bestScores[attempt.user] = {
              totalScore: attempt.totalScore,
              completedAt: attempt.completedAt
            };
          }
        });

        const leaderboardEntries = Object.entries(bestScores)
          .map(([userId, data]) => ({
            user: userId,
            userName: 'Loading...', // Will be updated with actual name
            totalScore: data.totalScore,
            completedAt: data.completedAt
          }))
          .sort((a, b) => b.totalScore - a.totalScore);

        console.log('Leaderboard entries before user details:', leaderboardEntries);
        return leaderboardEntries;
      }),
      switchMap(entries => {
        const userDetailRequests = entries.map(entry => 
          this.getUserDetails(entry.user).pipe(
            map(user => ({
              ...entry,
              userName: user.name
            }))
          )
        );
        return forkJoin(userDetailRequests);
      })
    );
  }

  getOverallLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.getUserResponses().pipe(
      map((responses) => {
        console.log('All responses for overall:', responses);
        const userStats: { [userId: string]: { totalScore: number; attempts: number } } = {};
        
        responses.forEach((attempt) => {
          if (!userStats[attempt.user]) {
            userStats[attempt.user] = { totalScore: 0, attempts: 0 };
          }
          userStats[attempt.user].totalScore += attempt.totalScore;
          userStats[attempt.user].attempts += 1;
        });

        const leaderboardEntries = Object.entries(userStats)
          .map(([userId, stats]) => ({
            user: userId,
            userName: 'Loading...', // Will be updated with actual name
            totalScore: stats.totalScore,
            completedAt: new Date().toISOString(),
            percentage: (stats.totalScore / (stats.attempts * 100)) * 100
          }))
          .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

        console.log('Overall leaderboard entries before user details:', leaderboardEntries);
        return leaderboardEntries;
      }),
      switchMap(entries => {
        const userDetailRequests = entries.map(entry => 
          this.getUserDetails(entry.user).pipe(
            map(user => ({
              ...entry,
              userName: user.name
            }))
          )
        );
        return forkJoin(userDetailRequests);
      })
    );
  }
}
