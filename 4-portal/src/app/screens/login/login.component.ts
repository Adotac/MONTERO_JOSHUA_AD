import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private api: HttpClient) {}

  loginForm: FormGroup = new FormGroup({
    fcEmail: new FormControl('', Validators.required),
    fcPassword: new FormControl('', Validators.required),
  });
  
  ngOnInit(): void {}
  
  async onLogin() {
    try{
      var email = this.loginForm.value['fcEmail'];
      var passw = this.loginForm.value['fcPassword'];
      var result: any = await this.api.post(environment.API_URL + "/user/login", {
        email: email,
        password: passw 
      }).toPromise();

      if(result.success){
        //alert('Success');
        this.nav('home');
      }
      else {
        alert('Incorrect credentials');
        console.log('Nagkakamali ka ng susi');
      }
    }
    catch(e){
      console.log(e);
      alert('HttpError, please try again...');
      //console.log("WAY AYOOOOOOOO");
    }
  }
  nav(destination: string) {
    this.router.navigate([destination]);
  }
}