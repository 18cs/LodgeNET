import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private jwtHelperService: JwtHelperService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    // const user: User = JSON.parse(localStorage.getItem('user'));
    if (token && this.authService.loggedIn()) {
      this.authService.decodedToken = this.jwtHelperService.decodeToken(token);
      this.authService.currentUser = this.authService.decodedToken.unique_name;
      this.authService.accountType = this.authService.decodedToken.role;
    }
    // if (user) {
    //   this.authService.currentUser = user
    // }
  }
}


// baseUrl = environment.apiUrl;
// userToken: any;
// decodedToken: any;
// currentUser: any;
// accountType: string;
