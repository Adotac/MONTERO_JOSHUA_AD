import { CRUDReturn } from './user.resource/crud_return.interface';
import { Helper } from './user.resource/helper';

import { Injectable } from '@nestjs/common';
import { User } from './user.resource/user.model';

@Injectable()
export class UserService {
    private users: Map<string,User> = new Map<string,User>();
    email: string;
    password: string;

    constructor(){
        this.users = Helper.populate(); 
    }

    register(u:any): CRUDReturn{
        //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        var newUser: User;
        try{
            var validBodyPut: { valid: boolean; data: string } = Helper.validBodyPut(u);   
            if(validBodyPut.valid){
                if(!this.emailExists(u.email)){
                    var newUser: User = new User(
                        u.name,
                        u.age,
                        u.email,
                        u.password
                    );
                    if(this.saveToDB(newUser)){
                        return {
                            success: true,
                            data: newUser.toJson()
                        };
                    }
                    else{
                        throw new Error('generic database error');
                    }
                }
                else{
                    throw new Error(`${u.email} is already in use by another user!`);
                }
            }
            else{
                throw new Error(validBodyPut.data);
            }
            
        }catch(e){
            console.log(e.message);
            return {success: false, data: `Error adding document, ${e.message}`};
        }
    }

    emailExists(email: string): boolean{
        try{
            for(const u of this.users.values()){
                if(u.matches(email))
                    return true;
            }
        }
        catch(error){
            console.log(error);
        }
        return false;
    }

    saveToDB(user: User): boolean{
        try{
            this.users.set(user.id, user);
            return this.users.has(user.id);
        }
        catch(error){
            console.log(error);
            return false;
        }
    }

    getAllUsers(): CRUDReturn{
        var results: Array<any> = [];
        for(const u of this.users.values()){
            results.push(u.toJson());
        }
        return { success: results.length > 0, data: results};
    }

    logAllUsers(){ console.log(this.getAllUsers()); }

    getUser(id: string): CRUDReturn{
        if(this.users.has(id)){
            return {success: true, data: this.users.get(id).toJson()};
        }
        else{
            return{success: false, data: `User ${id} is not in the database.`};
        }

    }

    searchUser(term: string): CRUDReturn{
        var results: Array<any> = [];
        for(const u of this.users.values()){
            if(u.matches(term))
                results.push(u.toJson());
        }
        return { success: results.length > 0, data: results};
    }

    replacePut(u: any, id: string): CRUDReturn{
        try{
            if(this.users.has(id)){
                var validBodyPut: { valid: boolean; data: string } = Helper.validBodyPut(u);
                if(validBodyPut.valid){
                    if(u.hasOwnProperty('id')) { 
                        throw new Error('Cannot replace the generated id'); }

                    for(const key of this.users.values()){
                        if(key.matches(id)){
                            if(this.emailExists(u.email) && !key.matches(u.email) ){
                                //console.log(key.getProp('email') + "++++++++++++++");
                                throw new Error(`${u.email} is already in use!`); 
                            }
                            else{ 
                                return {success: key.replaceValues(u), data: key.toJson()};
                            }
                        }
                    }
                }
                else{
                    throw new Error(validBodyPut.data);
                }
            }
            else{
                return{success: false, data: `User ${id} is not in the database.`};
            }
            
        }
        catch(e){
            //console.log(e.message);
            console.log(e.message + "\n");
            //this.logAllUsers();
            return {success: false, data: `Error adding document, ${e.message}`};
        }

    }

    replacePatch(u: any, id: string): CRUDReturn{
        try{
            if(this.users.has(id)){
                var validBody: { valid: boolean; data: string } = Helper.validBody(u);
                if(validBody.valid){
                    if(u.hasOwnProperty('id')) { 
                        throw new Error('Cannot replace the generated id'); }
                    
                    for(const key of this.users.values()){
                        if(key.matches(id)){
                            if(this.emailExists(u.email) && !key.matches(u.email) ){
                                throw new Error(`${u.email} is already in use!`); 
                            }
                            else{ 
                                return {success: key.replaceValues(u), data: key.toJson()};
                            }
                        }
                    }
                }
                else{
                    throw new Error(validBody.data);
                }
            }
            else{
                return{success: false, data: `User ${id} is not in the database.`};
            }
            
        }
        catch(e){
            console.log(e.message + "\n");
            //this.logAllUsers();
            return {success: false, data: `Error adding document, ${e.message}`};
        }
    }

    deleteUser(id: string): CRUDReturn{
        if(this.users.has(id)){
            return {
                success: this.users.delete(id),
                data: `User ${id} has been successfully deleted`
            };
        }
        else{
            return {
                success: false,
                data: `User ${id} doesn't exist in database`
            };
        }
    }

    loginUser(u: any): CRUDReturn{
        try{
            for(const key of this.users.values()){
                if(key.matches(u.email)){
                    return key.login(u.password);
                }                  
            }
            throw new Error(`${u.email} doesn't exist!`);
        }
        catch(e){
            console.log(e.message);
            return {success: false, data: `${e.message}`};
        }

    }
    
}