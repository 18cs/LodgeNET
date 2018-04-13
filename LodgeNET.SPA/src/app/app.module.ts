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
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './_guards/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    UsersComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    FilterPipe,
    FilterNumPipe,
    SortPipe
],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
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
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
