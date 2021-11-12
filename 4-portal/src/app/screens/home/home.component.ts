import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { from, asyncScheduler } from 'rxjs';

@Component({
  selector: 'app-home', 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {
  
  constructor(private router: Router, private api: HttpClient) {
  }

  filter = new FormControl('');

  navForm: FormGroup = new FormGroup({
    fcSearch: new FormControl('', Validators.required),
  });

  editForm: FormGroup = new FormGroup({
    fcName: new FormControl(''),
    fcAge: new FormControl('', Validators.min(1)),
    fcEmail: new FormControl('',Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
    fcPassword: new FormControl(''),
  });
  
  userDB:any; 
  
  currentSelected_User: any;
  

  ngOnInit(): void {
    this.getAllUsers();

    this.onChanges();
  }
  onChanges(): void{
    this.navForm.valueChanges.subscribe(term =>{
      console.log(term.fcSearch)
      if(term.fcSearch == ''){
        this.getAllUsers();
      }            
      else{
        this.onSearch();
      }
    })
  }

  test(c:any){
    alert(c);
  }


  async onSearch(){
    var result: any =  await this.api.get(environment.API_URL + "/user/search/"+ 
    this.navForm.value['fcSearch']).toPromise();
    //console.log(result.data);
    
    this.userDB = result.data;
    //console.log(this.navForm.value['fcSearch'] + result.success);
  }

  async getAllUsers(){
    var result: any = await this.api.get(environment.API_URL + "/user/all").toPromise();
    this.userDB = result.data;
    //this.test("DISPLAYING ALL USERS");
  }


  //////EDIT USER FROM TABLE ALL////////
  editPop_Flag:boolean = false;
  editUser(user:any){
    this.editPop_Flag = true;
    this.currentSelected_User = user;
  }
  close_editUser(){
    this.currentSelected_User = null;
    this.editPop_Flag = false;
    this.editForm.reset({fcName:'',fcAge:'',fcEmail:'',fcPassword:''});
  }
  async applyEdit(id:string){
    var result: any;
    if(this.editForm.value['fcName'] != ''){
      result = await this.api.patch(environment.API_URL + "/user/"+id,
      {name: this.editForm.value['fcName']} ).toPromise();
      console.log("name = " + result.success);
    }
    if(this.editForm.value['fcAge'] != ''){
      result = await this.api.patch(environment.API_URL + "/user/"+id,
      {age: this.editForm.value['fcAge']} ).toPromise();
      console.log("age = " + result.success);
    }
    if(this.editForm.value['fcEmail'] != ''){
      result = await this.api.patch(environment.API_URL + "/user/"+id,
      {email: this.editForm.value['fcEmail']} ).toPromise();
      console.log("email = " + result.success);
    }
    if(this.editForm.value['fcPassword'] != ''){
      result = await this.api.patch(environment.API_URL + "/user/"+id,
      {password: this.editForm.value['fcPassword']} ).toPromise();
      console.log("password = " + result.success);
    }
    window.location.reload();
    this.editForm.reset({fcName:'',fcAge:'',fcEmail:'',fcPassword:''});
  }
//////////////////
  async deleteUser(id:string){
    var result: any = await this.api.delete(environment.API_URL + "/user/"+id).toPromise();
    console.log("delete = " + result.success);
    window.location.reload();
  }
  async reset_DB(){
    var result: any = await this.api.patch(environment.API_URL + "/user/reset",{}).toPromise();
    window.location.reload();
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }
}

