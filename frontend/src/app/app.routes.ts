import { Routes } from '@angular/router';
import { AdminDeshboardComponent } from './features/admin-dashboard/pages/admin-deshboard/admin-deshboard.component';
import { UserDeshboardComponent } from './features/user-dashboard/pages/user-deshboard/user-deshboard.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { PlayQuizComponentComponent } from './features/user-dashboard/components/play-quiz-component/play-quiz-component.component';
import { MyQuizzesComponent } from './features/user-dashboard/pages/my-quizzes/my-quizzes.component';

export const routes: Routes = [
    {path:'', component:LoginComponent},
    {path:'login', component:LoginComponent},
    {path:'deshboard', component:AdminDeshboardComponent},
    {path:'home', component:UserDeshboardComponent},
    {path:'register', component:RegisterComponent},
    {path:'playquiz', component:PlayQuizComponentComponent},
    {path:'myquizzes', component:MyQuizzesComponent},
];
