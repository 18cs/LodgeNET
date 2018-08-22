import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './users/login/login.component';
import { SignupComponent } from './users/signup/signup.component';
import { AuthappComponent } from './authapp/authapp.component';
import { DashboardComponent } from './authapp/dashboard/dashboard.component';
import { FileuploadComponent } from './authapp/fileupload/fileupload.component';
import { LoggedinGuard } from './_guards/loggedin.guard';
import { AccountTypeGuard } from './_guards/accounttype.guard';
import { CheckinComponent } from './authapp/checkin/checkin.component';
import { GuestinfoComponent } from './authapp/checkin/guestinfo/guestinfo.component';
import { RoomselectComponent } from './authapp/checkin/roomselect/roomselect.component';
import { ReviewcheckinComponent } from './authapp/checkin/reviewcheckin/reviewcheckin.component';
import { ViewComponent } from './authapp/view/view.component';
import { ViewbuildingsComponent } from './authapp/view/viewbuildings/viewbuildings.component';
import { ViewguestsComponent } from './authapp/view/viewguests/viewguests.component';
import { ViewroomsComponent } from './authapp/view/viewrooms/viewrooms.component';
import { ViewunitsComponent } from './authapp/view/viewunits/viewunits.component';
import { ViewusersComponent } from './authapp/view/viewusers/viewusers.component';
import { CheckoutComponent } from './authapp/checkout/checkout.component';
import { LostComponent } from './home/lost/lost.component';
import { FormdataResolver } from './_resolvers/formdata-resolver.service';
import { UnitsResolverService } from './_resolvers/units-resolver.service';
import { ServicesResolverService } from './_resolvers/services-resolver.service';
import { ViewbuildingtypesComponent } from './authapp/view/viewbuildingtypes/viewbuildingtypes.component';
import { BuildingsResolverService } from './_resolvers/buildings-resolver.service';
import { ReportsComponent } from './authapp/reports/reports.component';
import { GuestsbybuildingComponent } from './authapp/reports/guestsbybuilding/guestsbybuilding.component';
import { GuestsbyserviceComponent } from './authapp/reports/guestsbyservice/guestsbyservice.component';
import { VacantroomsComponent } from './authapp/reports/vacantrooms/vacantrooms.component';
import { InhouseComponent } from './authapp/reports/inhouse/inhouse.component';
import { ManageuploadsComponent } from './authapp/fileupload/manageuploads/manageuploads.component';

 const appRoutes: Routes =
[
  {path: '', component: AuthappComponent, canActivate: [AuthGuard],
  data: { authGuardRedirect: 'home' }, children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard',  component: DashboardComponent},
    {path: 'upload/manage', component: ManageuploadsComponent, canActivate: [AccountTypeGuard],
      data: { accountTypeRedirect: 'home', unauthorizedAccountType: 'Viewer' }},
    {path: 'upload/:type', component: FileuploadComponent, canActivate: [AccountTypeGuard],
      data: { accountTypeRedirect: 'home', unauthorizedAccountType: 'Viewer' }},
    {path: 'upload', redirectTo: 'upload/lodging',  pathMatch: 'full', canActivate: [AccountTypeGuard],
      data: { accountTypeRedirect: 'home', unauthorizedAccountType: 'Viewer' }},
    {path: 'checkin', component: CheckinComponent, canActivate: [AccountTypeGuard],
      data: { accountTypeRedirect: 'home', unauthorizedAccountType: 'Viewer' },
        children: [
          {path: '', redirectTo: 'guestinfo', pathMatch: 'full'},
          {path: 'guestinfo', component: GuestinfoComponent},
          {path: 'roomselect', component: RoomselectComponent},
          {path: 'reviewcheckin', component: ReviewcheckinComponent}
    ]},
    {path: 'view', component: ViewComponent, children: [
      {path: '', redirectTo: 'guests', pathMatch: 'full'},
      {path: 'buildings', component: ViewbuildingsComponent},
      {path: 'buildingtypes', component: ViewbuildingtypesComponent},
      {path: 'guests', component: ViewguestsComponent, resolve: {formData: FormdataResolver} },
      {path: 'rooms', component: ViewroomsComponent, resolve: { buildings: BuildingsResolverService }},
      {path: 'units', component: ViewunitsComponent, resolve: { units: UnitsResolverService }},
      {path: 'users/:approved', component: ViewusersComponent},
      {path: 'users', component: ViewusersComponent}
    ]},
    {path: 'reports', component: ReportsComponent, children: [
      {path: '', redirectTo: 'inhouse', pathMatch: 'full'},
      {path: 'inhouse', component: InhouseComponent},
      {path: 'guestsbybuilding', component: GuestsbybuildingComponent, resolve: { buildings: BuildingsResolverService }},
      {path: 'guestsbyservice', component: GuestsbyserviceComponent, resolve: { services: ServicesResolverService }},
      {path: 'vacantrooms', component: VacantroomsComponent, resolve: { buildings: BuildingsResolverService }}
    ]},
    {path: 'checkout', component: CheckoutComponent, canActivate: [AccountTypeGuard],
      data: { accountTypeRedirect: 'home', unauthorizedAccountType: 'Viewer' }}
  ] },
  {path: 'home', component: HomeComponent, canActivate: [LoggedinGuard] },
  {path: 'users', component: UsersComponent, canActivate: [LoggedinGuard], children: [
    {path: '', redirectTo: 'login',  pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent}
  ]},
  {path: 'lost', component: LostComponent},
  {path: '**', redirectTo: 'lost'}
];
// , canActivate: [AuthGuard], data: { authGuardRedirect: '/home' }
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
