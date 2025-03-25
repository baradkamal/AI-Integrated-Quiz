import { Routes } from '@angular/router';
import { AdminDeshboardComponent } from './features/admin-dashboard/pages/admin-deshboard/admin-deshboard.component';
import { UserDeshboardComponent } from './features/user-dashboard/pages/user-deshboard/user-deshboard.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

export const routes: Routes = [
    {path:'', component:LoginComponent},
    {path:'deshboard', component:AdminDeshboardComponent},
    {path:'home', component:UserDeshboardComponent},
    {path:'register', component:RegisterComponent},
];
