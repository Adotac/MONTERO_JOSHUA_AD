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
    prrr(){
        for(const [key, u] of this.users.entries()){
            console.log(key);
            u.log();
            
        }
     }

    populate(){
        this.users.set("100",new User("100","James",18,"james@email.com","123456"));
        this.users.set("101",new User("101","John",18,"john@email.com","143441"));
        this.users.set("102",new User("102","Luke",18,"luke@email.com","654321"));
        this.users.set("103",new User("103","Judas",13,"judas@email.com","696969"));
    }

    register(_users:any){
        var newUser: User;
        newUser = new User(this.generateID(this.users), _users?._name, _users?._age, _users?._email, _users?._password);
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
                    if(tempID.localeCompare(user.id)){
                        i = 0; //reset
                        tempID = "";
                    }
                }
            }
        }
        return tempID;
    }

}