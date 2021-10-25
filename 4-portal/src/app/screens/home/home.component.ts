import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home', 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private api: HttpClient) {}

  navForm: FormGroup = new FormGroup({
    fcSearch: new FormControl('', Validators.required),
  });

  editForm: FormGroup = new FormGroup({
    fcName: new FormControl(''),
    fcAge: new FormControl('', Validators.min(1)),
    fcEmail: new FormControl('',Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
    fcPassword: new FormControl(''),
  });

  getAll_Flag: boolean = false;
  editProfile_Flag: boolean = false;
  searchFlag:boolean = false;
  userDB: any; searchDB:any;
  currentSelected_User: any;
  

  ngOnInit(): void {
    this.getAllUsers();
  }

  test(c:any){
    alert(c);
  }
  async onSearch(){
    var result: any = await this.api.get(environment.API_URL + "/user/search/"+
    this.navForm.value['fcSearch']).toPromise();
    this.searchDB = result.data;
    console.log(this.navForm.value['fcSearch'] + result.success);
  }

  async getAllUsers(){
    var result: any = await this.api.get(environment.API_URL + "/user/all").toPromise();
    this.userDB = result.data;
  }


  //////EDIT USER FROM TABLE ALL////////
  editPop_Flag:boolean = false;
  editUser(user:any){
    this.currentSelected_User = user;
    this.editPop_Flag = true;
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
    document.getElementById('allBtn')?.click();
    this.editForm.reset({fcName:'',fcAge:'',fcEmail:'',fcPassword:''});
  }
//////////////////
  async deleteUser(id:string){
    var result: any = await this.api.delete(environment.API_URL + "/user/"+id).toPromise();
    console.log("delete = " + result.success);
    window.location.reload();
  }

  apiButtons(index:number){
    switch(index){
      case 1:
        this.getAll_Flag = false;
        this.editProfile_Flag = false;
        this.searchFlag = false;
        break;
      case 2:
        this.getAll_Flag = true;
        this.editProfile_Flag = false;
        this.searchFlag = false;
        break;
      case 3:
        this.getAll_Flag = false;
        this.editProfile_Flag = true;
        this.searchFlag = false;
        break;
      case 4:
        this.getAll_Flag = false;
        this.editProfile_Flag = false;
        this.searchFlag = true;
        break;
      case 5:
        //Delete Function
        break;
          

    }
  }
  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
