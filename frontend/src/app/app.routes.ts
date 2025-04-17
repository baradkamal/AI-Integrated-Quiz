import { Routes } from '@angular/router';
import { AdminDeshboardComponent } from './features/admin-dashboard/pages/admin-deshboard/admin-deshboard.component';
import { UserDeshboardComponent } from './features/user-dashboard/pages/user-deshboard/user-deshboard.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { PlayQuizComponentComponent } from './features/user-dashboard/components/play-quiz-component/play-quiz-component.component';
import { MyQuizzesComponent } from './features/user-dashboard/pages/my-quizzes/my-quizzes.component';
import { UserLayoutComponent } from './layouts/user/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';
import { LeaderboardComponent } from './features/user-dashboard/pages/leaderboard/leaderboard.component';
import { UserProfileComponent } from './features/user-dashboard/components/user-profile/user-profile.component';
import { authGuard } from './core/guards/auth.guard';
import { ManageUsersComponent } from './features/admin-dashboard/components/manage-users/manage-users.component';
import { ManageQuizzesComponent } from './features/admin-dashboard/components/manage-quizzes/manage-quizzes.component';
import { AnalyticsComponent } from './features/admin-dashboard/components/analytics/analytics.component';
import { CreateNewQuizComponent } from './features/admin-dashboard/components/create-new-quiz/create-new-quiz.component';
import { AddnewuserComponent } from './features/admin-dashboard/components/addnewuser/addnewuser.component';
import { ManageQuestationComponent } from './features/admin-dashboard/components/manage-questation/manage-questation.component';
import { CreateNewQuestionsComponent } from './features/admin-dashboard/components/create-new-questions/create-new-questions.component';

export const routes: Routes = [
    {path:'', component:UserLayoutComponent,canActivate: [authGuard],
        children: [
            {path:'home', component:UserDeshboardComponent},
            {path:'playquiz', component:PlayQuizComponentComponent},
            {path:'myquizzes', component:MyQuizzesComponent},
            {path:'leaderboard', component:LeaderboardComponent},
            {path:'profile', component:UserProfileComponent},
        ],
    },
    {path:'', component:AdminLayoutComponent,canActivate: [authGuard],
        children: [
            {path:'deshboard', component:AdminDeshboardComponent},
            {path:'user-management', component:ManageUsersComponent},
            {path:'manage-quizzes', component:ManageQuizzesComponent},
            {path:'analytics', component:AnalyticsComponent},
            {path:'createnewquiz', component:CreateNewQuizComponent},
            {path:'addnewuser', component:AddnewuserComponent},
            {path:'Questation', component:ManageQuestationComponent},
            {path:'profileadmin', component:UserProfileComponent},
            {path:'addnewquestion', component:CreateNewQuestionsComponent},
        ],
    },
    {path:'', component:LoginComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    
    
];
