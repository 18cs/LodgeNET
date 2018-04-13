import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './users/login/login.component';
import { SignupComponent } from './users/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {path: 'dashboard', 
    component: DashboardComponent, 
    pathMatch: 'full', 
    canActivate: [AuthGuard], 
    data: { authGuardRedirect: 'home' }},
  {path: 'home', component: HomeComponent },
  {path: 'users', component: UsersComponent, children: [
    {path: '', redirectTo: 'login',  pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent}
  ]}
];
// , canActivate: [AuthGuard], data: { authGuardRedirect: '/home' }
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
