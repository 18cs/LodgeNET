import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
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
import { GueststayService } from './_services/gueststay.service';
import { CheckoutComponent } from './authapp/checkout/checkout.component';
import { MaterialModule } from './material.module';
import { BuildingsdialogComponent } from './authapp/view/dialogcomponents/buildingsdialog/buildingsdialog.component';
import { BuildingtypesdialogComponent } from './authapp/view/dialogcomponents/buildingtypesdialog/buildingtypesdialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LostComponent } from './home/lost/lost.component';
import { UnaccompanieddialogComponent } from './authapp/fileupload/dialogcomponents/unaccompanieddialog/unaccompanieddialog.component';
import { FileuploadService } from './_services/fileupload.service';
import { LodgingDialogComponent } from './authapp/fileupload/dialogcomponents/lodgingDialog/lodgingDialog.component';
import { EdituserComponent } from './authapp/view/viewusers/edituser/edituser.component';
import { FormdataResolver } from './_resolvers/formdata-resolver.service';
import { EditguestComponent } from './authapp/view/viewguests/editguest/editguest.component';
import { GueststaydialogComponent } from './authapp/view/dialogcomponents/gueststaydialog/gueststaydialog.component';
import { UnitsResolverService } from './_resolvers/units-resolver.service';
import { UnitdialogComponent } from './authapp/view/dialogcomponents/unitdialog/unitdialog.component';
import { RoomsdialogComponent } from './authapp/view/dialogcomponents/roomsdialog/roomsdialog.component';
import { BuildingsResolverService } from './_resolvers/buildings-resolver.service';
import { AccountTypeGuard } from './_guards/accounttype.guard';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { PendingscandialogComponent } from './_utilities/pendingscandialog/pendingscandialog.component';
import { ManageuploadsComponent } from './authapp/fileupload/manageuploads/manageuploads.component';
import { ReportsComponent } from './authapp/reports/reports.component';
import { GuestsbyserviceComponent } from './authapp/reports/guestsbyservice/guestsbyservice.component';
import { InhouseComponent } from './authapp/reports/inhouse/inhouse.component';
import { GuestsbybuildingComponent } from './authapp/reports/guestsbybuilding/guestsbybuilding.component';
import { VacantroomsComponent } from './authapp/reports/vacantrooms/vacantrooms.component';
import { FileexportService } from './_services/fileexport.service';

export function getAccessToken(): string {
  return localStorage.getItem('token');
}

export const jwtConfig = {
  tokenGetter: getAccessToken,
  whitelistedDomains: ['localhost:5000']
};

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
    BuildingtypesdialogComponent,
    UnaccompanieddialogComponent,
    LodgingDialogComponent,
    EdituserComponent,
    EditguestComponent,
    GueststaydialogComponent,
    UnitdialogComponent,
    ViewbuildingtypesComponent,
    RoomsdialogComponent,
    PendingscandialogComponent,
    ManageuploadsComponent,
    ReportsComponent,
    InhouseComponent,
    GuestsbybuildingComponent,
    GuestsbyserviceComponent,
    VacantroomsComponent
],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FileUploadModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: jwtConfig
    }),
    PaginationModule.forRoot(),
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    AlertifyService,
    UnitsService,
    GueststayService,
    AuthGuard,
    LoggedinGuard,
    AccountTypeGuard,
    BuildingService,
    FileuploadService,
    FormdataResolver,
    UnitsResolverService,
    BuildingsResolverService,
    ErrorInterceptorProvider,
    FileexportService
  ],
  bootstrap: [AppComponent],
  entryComponents: [BuildingsdialogComponent,
    UnaccompanieddialogComponent,
    LodgingDialogComponent,
    UnitdialogComponent,
    BuildingtypesdialogComponent,
    GueststaydialogComponent,
    RoomsdialogComponent,
    PendingscandialogComponent
  ]
  // exports: [MatFormField]
})
export class AppModule { }
