import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
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
import { FileuploadComponent } from './authapp/fileupload/fileupload.component';
import { LoggedinGuard } from './_guards/loggedin.guard';
import { BuildingService } from './_services/building.service';
import { CheckinComponent } from './authapp/checkin/checkin.component';
import { GuestinfoComponent } from './authapp/checkin/guestinfo/guestinfo.component';
import { RoomselectComponent } from './authapp/checkin/roomselect/roomselect.component';
import { ReviewcheckinComponent } from './authapp/checkin/reviewcheckin/reviewcheckin.component';
import { ViewComponent } from './authapp/view/view.component';
import { ViewbuildingsComponent } from './authapp/view/viewbuildings/viewbuildings.component';
import { ViewbuildingtypesComponent } from './authapp/view/viewbuildingtypes/viewbuildingtypes.component';
import { ViewguestsComponent } from './authapp/view/viewguests/viewguests.component';
import { ViewroomsComponent } from './authapp/view/viewrooms/viewrooms.component';
import { ViewunitsComponent } from './authapp/view/viewunits/viewunits.component';
import { ViewusersComponent } from './authapp/view/viewusers/viewusers.component';
import { CheckinService } from './_services/checkin.service';
import { GueststayService } from './_services/gueststay.service';
import { CheckoutComponent } from './authapp/checkout/checkout.component';
import { MaterialModule } from './material.module';
import { BuildingsdialogComponent } from './authapp/view/dialogcomponents/buildingsdialog/buildingsdialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LostComponent } from './home/lost/lost.component';
import { UnaccompanieddialogComponent } from './authapp/fileupload/dialogcomponents/unaccompanieddialog/unaccompanieddialog.component';
import { FileuploadService } from './_services/fileupload.service';
import { LodgingDialogComponent } from './authapp/fileupload/dialogcomponents/lodgingDialog/lodgingDialog.component';
import { EdituserComponent } from './authapp/view/viewusers/edituser/edituser.component';
import { FormdataResolver } from './_resolvers/formdata-resolver.service';
import { EditguestComponent } from './authapp/view/viewguests/editguest/editguest.component';

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
    FileuploadComponent,
    CheckinComponent,
    CheckoutComponent,
    GuestinfoComponent,
    RoomselectComponent,
    ReviewcheckinComponent,
    ViewComponent,
    ViewbuildingsComponent,
    ViewguestsComponent,
    ViewroomsComponent,
    ViewunitsComponent,
    ViewusersComponent,
    LostComponent,
    FilterPipe,
    FilterNumPipe,
    SortPipe,
    DropdownDirective,
    BuildingsdialogComponent,
    UnaccompanieddialogComponent,
    LodgingDialogComponent,
    EdituserComponent,
    EditguestComponent,
    ViewbuildingtypesComponent
],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FileUploadModule,
    FormsModule,
    HttpClientModule,
    PaginationModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000']
      }
    }),
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    AlertifyService,
    UnitsService,
    CheckinService,
    GueststayService,
    AuthGuard,
    LoggedinGuard,
    BuildingService,
    FileuploadService,
    FormdataResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [BuildingsdialogComponent,
    UnaccompanieddialogComponent,
    LodgingDialogComponent
  ]
  // exports: [MatFormField]
})
export class AppModule { }
