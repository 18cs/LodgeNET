import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './users/login/login.component';
import { SignupComponent } from './users/signup/signup.component';
import { AuthappComponent } from './authapp/authapp.component';
import { DashboardComponent } from './authapp/dashboard/dashboard.component';
import { LodgingfileuploadComponent } from './authapp/lodgingfileupload/lodgingfileupload.component';
import { LoggedinGuard } from './_guards/loggedin.guard';
import { CheckinComponent } from './authapp/checkin/checkin.component';
import { GuestinfoComponent } from './authapp/checkin/guestinfo/guestinfo.component';
import { RoomselectComponent } from './authapp/checkin/roomselect/roomselect.component';
import { ReviewcheckinComponent } from './authapp/checkin/reviewcheckin/reviewcheckin.component';

 const appRoutes: Routes = 
//   {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//   {path: 'dashboard',
//     component: DashboardComponent,
//     pathMatch: 'full',
//     canActivate: [AuthGuard],
//     data: { authGuardRedirect: 'home' }},
//   {path: 'home', component: HomeComponent },
//   {path: 'users', component: UsersComponent, children: [
//     {path: '', redirectTo: 'login',  pathMatch: 'full'},
//     {path: 'login', component: LoginComponent},
//     {path: 'signup', component: SignupComponent}
//   ]},
//   {path: 'upload', component: FileUploadComponent}  //could be /data/upload
// ];
[
  {path: '', component: AuthappComponent, canActivate: [AuthGuard],
  data: { authGuardRedirect: 'home' }, children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard',  component: DashboardComponent},
    {path: 'upload',  children: [
      {path: '', redirectTo: 'lodging',  pathMatch: 'full'},
      {path: 'lodging', component: LodgingfileuploadComponent}
    ]},
    {path: 'checkin', component: CheckinComponent, children: [
      {path: '', redirectTo: 'guestinfo', pathMatch: 'full'},
      {path: 'guestinfo', component: GuestinfoComponent},
      {path: 'roomselect', component: RoomselectComponent},
      {path: 'reviewcheckin', component: ReviewcheckinComponent}
    ]}
  ] },
  {path: 'home', component: HomeComponent, canActivate: [LoggedinGuard] },
  {path: 'users', component: UsersComponent, canActivate: [LoggedinGuard], children: [
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
