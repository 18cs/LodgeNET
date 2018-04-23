import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './nav/header/navbar.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './users/login/login.component';
import { SignupComponent } from './users/signup/signup.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';
import { UnitsService } from './_services/units.service';
import { FilterPipe } from './_pipes/filter.pipe';
import { FilterNumPipe } from './_pipes/filterNum.pipe';
import { SortPipe } from './_pipes/sort.pipe';
import { AuthGuard } from './_guards/auth.guard';
import { DropdownDirective } from './_directives/dropdown.directive';
import { FileUploadModule } from 'ng2-file-upload';
import { AuthappComponent } from './authapp/authapp.component';
import { DashboardComponent } from './authapp/dashboard/dashboard.component';
import { LodgingfileuploadComponent } from './authapp/lodgingfileupload/lodgingfileupload.component';
import { LoggedinGuard } from './_guards/loggedin.guard';
import { BuildingService } from './_services/building.service';
import { CheckinComponent } from './authapp/checkin/checkin.component';
import { GuestinfoComponent } from './authapp/checkin/guestinfo/guestinfo.component';
import { RoomselectComponent } from './authapp/checkin/roomselect/roomselect.component';
import { ReviewcheckinComponent } from './authapp/checkin/reviewcheckin/reviewcheckin.component';
import { CheckinService } from './_services/checkin.service';
import { GueststayService } from './_services/gueststay.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    UsersComponent,
    LoginComponent,
    SignupComponent,
    AuthappComponent,
    DashboardComponent,
    LodgingfileuploadComponent,
    CheckinComponent,
    GuestinfoComponent,
    RoomselectComponent,
    ReviewcheckinComponent,
    FilterPipe,
    FilterNumPipe,
    SortPipe,
    DropdownDirective
],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FileUploadModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000']
      }
    })
  ],
  providers: [
    AuthService,
    AlertifyService,
    UnitsService,
    CheckinService,
    GueststayService,
    AuthGuard,
    LoggedinGuard,
    BuildingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
