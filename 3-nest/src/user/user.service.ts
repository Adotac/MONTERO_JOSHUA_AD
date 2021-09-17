import { Body, Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
    private genKey: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    private users: Map<string,User> = new Map<string,User>();

    constructor(){
        this.populate();
    }

    getAll(){
       var populatedData = [];
       for(const user of this.users.values()){
           populatedData.push(user.toJson());

       }
       return populatedData;
    }

    populate(){
        this.users.set("100",new User("100","James",18,"james@email.com","123456"));
        this.users.set("101",new User("101","John",18,"john@email.com","143441"));
        this.users.set("102",new User("102","Luke",18,"luke@email.com","654321"));
        this.users.set("103",new User("103","Judas",13,"judas@email.com","696969"));
    }

    searchTerm(term:string){
        try{
            for(const [key, u] of this.users.entries()){
                if(term.toLocaleUpperCase().localeCompare(u.name.toLocaleUpperCase())==0 ||
                term.toLocaleUpperCase().localeCompare(u.email.toLocaleUpperCase())==0 ||
                term.toLocaleUpperCase().localeCompare(u.id.toLocaleUpperCase())==0||
                term.toLocaleUpperCase().localeCompare(u.age.toLocaleString())==0) {
    
                    return u.toJson();
                }
            }
        }catch(e){
            console.error(e);
            return {status:false, error:e.toString()};
        }

        return false;
    }

    loginUser(b:any){
        var eTemp, pTemp;
        try{
            for(const u of this.users.values()){
                eTemp = u.email; pTemp = u.password;

                if(typeof b?.email === typeof toString() && 
                    typeof b?.password === typeof toString()){
                    
                    console.log("PASDASDASDASDAS");
                    if(eTemp.localeCompare(b?.email)==0 && pTemp.localeCompare(b?.password)==0){
                        console.log("928374");
                        return {message: "Login success!"};
                        
                    }
                }

                //console.log(b.email); console.log(u.email);
            }
            throw new Error('Login failed!');
        }catch(e){
            console.error(e);
            return {status:false, error:e.toString()};
        }
    }

    deleteUser(id:string){
        try{
            for(const [key, u] of this.users.entries()){
                if(id.localeCompare(key)==0){
                    this.users.delete(key);
                    return {message: "success!"};
                }
            }
            throw new Error('User doesn\'t exist!');
        }catch(e){
            console.error(e);
            return {status:false, error:e.toString()};
        }
    }

    putData(id:string, b:any){
        for(const [key, u] of this.users.entries()){
            if(id.localeCompare(key)==0){
                u.name = b?.name;
                u.age = b?.age;
                u.email = b?.email;
                u.password = b?.password;

                if(b.hasOwnProperty('name') && b.hasOwnProperty('age') &&
                b.hasOwnProperty('email') && b.hasOwnProperty('password') )
                    return true;

                break;
            }
        }

        return false;
    }

    patchData(id:string, b:any){
        var flag = true;
        for(const [key, u] of this.users.entries()){
            if(id.localeCompare(key)==0){
                try{
                    if(b.hasOwnProperty('name')){
                        if( typeof b?.name === typeof toString() )
                            u.name = b?.name;
                        else throw new Error('The name is invalid');
                        
                    }
                    if(b.hasOwnProperty('age')){
                        if( typeof b?.age === typeof 0)                           
                            u.age = b?.age;
                        else throw new Error('The age is invalid');
                        
                    }
                    if(b.hasOwnProperty('email')){
                        if(typeof b?.email === typeof toString())
                            u.email = b?.email;
                        else throw new Error('The email is invalid');

                    }
                    if(b.hasOwnProperty('password')){
                        if(typeof b?.password === typeof toString())
                            u.password = b?.password;
                        else throw new Error('The password is invalid');
                    }

                    return true;
                }catch(e){
                    console.error(e);
                    return {status:false, error:e.toString()};
                }
            }
        }
    }

    getUser(id:string){
        for(const [key, u] of this.users.entries()){
            if(id.localeCompare(key)==0)
                return u.toJson();
        }
        return false;
    }

    register(u:any){
        //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        var newUser: User;
        try{
            newUser = new User(u?.id, u?.name, u?.age, u?.email, u?.password);
            if(newUser.id === null || newUser.id === "")
                newUser.id = this.generateID(this.users);
        }catch(e){
            console.log(e);
            return false;
        };

        this.users.set(newUser.id, newUser);
        return true
    }

    private generateID(users: Map<string,User> ): string{
        var MAX = 5;
        var tempID = "";
        for(var i = 0; i < MAX; i++){
            tempID += this.genKey[Math.floor(Math.random()*this.genKey.length)];

            if(i == MAX-1){
                for(const user of users.values() ){
                    if(tempID.localeCompare(user.id)==0){
                        i = 0; //reset
                        tempID = "";
                    }
                }
            }
        }
        return tempID;
    }

}