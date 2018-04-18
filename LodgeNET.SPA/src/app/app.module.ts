import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './nav/header/navbar.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './users/login/login.component';
import { SignupComponent } from './users/signup/signup.component';
import { FilterPipe } from './_pipes/filter.pipe';
import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';
import { UnitsService } from './_services/units.service';
import { FilterNumPipe } from './_pipes/filterNum.pipe';
import { SortPipe } from './_pipes/sort.pipe';
import { AuthGuard } from './_guards/auth.guard';
import { DropdownDirective } from './_directives/dropdown.directive';
import { FileUploadModule } from 'ng2-file-upload';
import { AuthappComponent } from './authapp/authapp.component';
import { DashboardComponent } from './authapp/dashboard/dashboard.component';
import { LodgingfileuploadComponent } from './authapp/lodgingfileupload/lodgingfileupload.component';
import { LoggedinGuard } from './_guards/loggedin.guard';

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
    AuthGuard,
    LoggedinGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
