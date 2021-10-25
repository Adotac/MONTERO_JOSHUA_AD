import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private router: Router, private api: HttpClient) {}

  registerForm: FormGroup = new FormGroup({
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl(0, Validators.min(1)),
    fcEmail: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    fcPassword: new FormControl('', Validators.required),
    fcPassword2: new FormControl('', Validators.required),
  });

  error: string = '';

  ngOnInit(): void {}

  async onSubmit() {
    
    if (
      this.registerForm.value['fcPassword'] !==
      this.registerForm.value['fcPassword2']
    ) {
      this.error = 'Password doesnt match!';
      return;
    }
    if (this.registerForm.valid) {
      var payload: {
        name: string;
        email: string;
        age: number;
        password: string;
      };
      payload = {
        name: this.registerForm.value.fcName,
        age: this.registerForm.value.fcAge,
        email: this.registerForm.value.fcEmail,
        password: this.registerForm.value.fcPassword,
      };
      console.log(payload);
      await this.api.post(environment.API_URL + "/user/register", payload).toPromise();
      try{
        var result: any = await this.api.post(environment.API_URL + "/user/login", payload).toPromise();
        if(result.success){
          //alert('Success');
          this.nav('home');
        }
        else {
          alert('Registration Failed!');
          console.log('Registration Failed!');
        }
      }catch(e){
        console.log(e);
        alert('HttpError, please try again...');
      }
    }
  }



  nav(destination: string) {
    this.router.navigate([destination]);
  }
}