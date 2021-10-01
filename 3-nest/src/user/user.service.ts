import { CRUDReturn } from './user.resource/crud_return.interface';
import { Helper } from './user.resource/helper';

import { Injectable } from '@nestjs/common';
import { User } from './user.resource/user.model';

import * as admin from 'firebase-admin';

@Injectable()
export class UserService {
    private users: Map<string,User> = new Map<string,User>();
    private firestore = admin.firestore();

    constructor(){
        this.users = Helper.populate(); 
        this.populateFB_DB();
    }

    async populateFB_DB(){

        try{
            for (const u of this.users.values()) {
                console.log(`${u["email"]} processing!`);

                var emailFlag = await this.emailExists(u["email"]);
                    if(!emailFlag){
                        var sdb = await this.saveToDB(u);
                        if(sdb){
                            console.log(`${u["email"]} has been added!`);
                        }
                        else{
                            throw new Error('generic database error');
                        }
                    }
                    else{
                        console.log(`${u["email"]} is already in use by another user!`);
                    }
            }
        }
        catch(e){
            console.log(e.message);
            return {success: false, data: `Error adding populate document, ${e.message}`};
        }
    }

    async register(u:any): Promise<CRUDReturn>{
        //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        var newUser: User;
        try{
            var validBodyPut: { valid: boolean; data: string } = Helper.validBodyPut(u);   
            if(validBodyPut.valid){
                //console.log(!this.emailExists(u.email));
                const emailFlag = await this.emailExists(u.email);
                if(!emailFlag){
                    var newUser: User = new User(
                        u.name,
                        u.age,
                        u.email,
                        u.password
                    );
                    //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
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

    async emailExists(email: string, options?: {exceptionId: string}): Promise<boolean>{
        try{
            var userResults = 
            await this.firestore.collection("users")
            .where("email", "==", email)
            .get();

            console.log("Result empty: " + userResults.empty);
            if(userResults.empty){
                //console.log("GFFFFFFFF");
                return false;}

            for(const u of userResults.docs){
                console.log(u.data() +
                            "\nOption defined: "+ options!=undefined);
                if(options != undefined){
                    if(u.id == options?.exceptionId) continue;
                }
                if(u.data()['email'] === email){
                    return true;
                }
                else{
                    return false;
                }                
            }
            return false;
        }
        catch(error){
            console.log("Email exists subfunction error\n" + error.message);
            return false;
        }
    }

    async saveToDB(user: User): Promise<boolean>{
        try{
            const ref = this.firestore.collection("users").doc(user.id);
            await ref.set(user.toJsonFB());
            //console.log("\N\NSAVED TO SDBBBBB!!!\N\N");
            this.users.set(user.id, user);
            //return (await ref.doc(user.id).get()).exists && this.users.has(user.id);
            return (await ref.get()).exists;

        }
        catch(error){
            console.log(error);
            return false;
        }
    }

    async getAllUsers(): Promise<CRUDReturn>{
        var results: Array<any> = [];
        try {
            var dbData:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> 
            = await this.firestore.collection("users").get();

            dbData.forEach((doc)=>{
                if(doc.exists){
                    results.push({
                        id: doc.id, 
                        name: doc.data()['name'], 
                        age: doc.data()['age'],
                        email: doc.data()['email']
                    });
                }
                //console.log(doc.data());
            });


            // for (const user of this.users.values()) {
            //     results.push(user.toJson());
            // }

            return { success: true, data: results };
        } catch (e) {
            return { success: false, data: e };
        }
    }

    logAllUsers(){ console.log(this.getAllUsers()); }

    async getUser(id: string): Promise<CRUDReturn>{
        var tempUser:User;
        try{
            var dbData:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> 
            = await this.firestore.collection("users").get();

            dbData.forEach((doc)=>{
                if(doc.exists){
                    tempUser = new User(
                                doc.data()['name'],
                                doc.data()['age'],
                                doc.data()['email'],
                                doc.data()['password'] );
                    
                    if(doc.id === id){
                        throw 'Break';
                    }
                }
                
            });
            return{success: false, data: `User ${id} is not in the database.`}
        }catch(e){
            if(e === 'Break'){
                return {success: true, data: tempUser.toJson()};
            }
            console.log(e);
            return {success: false, data: `Error adding document, ${e.message}`};
        }

    }

    async searchUser(term: string): Promise<CRUDReturn>{
        var results: Array<any> = [];

        var dbData:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> 
            = await this.firestore.collection("users").get();

        dbData.forEach((doc)=>{
            if(doc.exists){
                var tempUser:User = new User(
                                    doc.data()['name'],
                                    doc.data()['age'],
                                    doc.data()['email'],
                                    doc.data()['password'] );
                if(tempUser.matches(term)){
                    results.push(tempUser.toJson());
                }
            }
            
        });
        // for(const u of this.users.values()){
        //     if(u.matches(term))
        //         results.push(u.toJson());
        // }
        return { success: results.length > 0, data: results};
    }

    async replacePut(u: any, id: string): Promise<CRUDReturn>{
        try{
            const dbData = this.firestore.collection("users").doc(id);
            const ddoc = await dbData.get();
            var tempUser:User = new User(
                                ddoc?.data()['name'],
                                ddoc?.data()['age'],
                                ddoc?.data()['email'],
                                ddoc?.data()['password']); 

            if(ddoc.exists){
                console.log(ddoc.data() + "\n++++++++++++++");     
                var validBodyPut: { valid: boolean; data: string } = Helper.validBodyPut(u);
                if(validBodyPut.valid){
                    if(u.hasOwnProperty('id')) { 
                        throw new Error('Cannot replace the generated id'); }

                    var emailFlag = await this.emailExists(u.email);
                    if( emailFlag  && !tempUser.matches(u.email)){
                        //console.log(key.getProp('email') + "++++++++++++++");
                        throw new Error(`${u.email} is already in use!`); 
                    }
                    else{ 
                        if(tempUser.replaceValues(u)){
                            const res = await dbData.update(tempUser.toJsonFB());
                            return {success: true, data: tempUser.toJson()};
                        }
                        else{
                            return {success: false, data: tempUser.toJson()};
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

    async replacePatch(u: any, id: string): Promise<CRUDReturn>{
        try{
            const dbData = this.firestore.collection("users").doc(id);
            const ddoc = await dbData.get();
            var tempUser:User = new User(
                                ddoc?.data()['name'],
                                ddoc?.data()['age'],
                                ddoc?.data()['email'],
                                ddoc?.data()['password']); 

            if(ddoc.exists){
                var validBody: { valid: boolean; data: string } = Helper.validBody(u);
                if(validBody.valid){
                    if(u.hasOwnProperty('id')) { 
                        throw new Error('Cannot replace the generated id'); }
                    
                    
                    var emailFlag = await this.emailExists(u.email);
                    if( emailFlag  && !tempUser.matches(u.email)){
                        //console.log(key.getProp('email') + "++++++++++++++");
                        throw new Error(`${u.email} is already in use!`); 
                    }
                    else{ 
                        if(tempUser.replaceValues(u)){
                            const res = await dbData.update(tempUser.toJsonFB());
                            return {success: true, data: tempUser.toJson()};
                        }
                        else{
                            return {success: false, data: tempUser.toJson()};
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

    async deleteUser(id: string): Promise<CRUDReturn>{
        const dbData = this.firestore.collection("users").doc(id);
        const ddoc = await dbData.get();
        try{
            if(ddoc.exists){
                dbData.delete().then(()=>{
                    return {
                        success: true,
                        data: `User ${id} has been successfully deleted`
                    };
                });
                
            }
            else{
                return {
                    success: false,
                    data: `User ${id} doesn't exist in database`
                };
            }
        }
        catch(e){
            console.log(e.message + "\n");
            //this.logAllUsers();
            return {success: false, data: `Error adding document, ${e.message}`};
        }
        
    }

    async loginUser(u: any): Promise<CRUDReturn>{
        var tempUser:User;
        try{    
            var dbData:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> 
            = await this.firestore.collection("users").get();

            dbData.forEach((doc)=>{
                if(doc.exists){
                    tempUser = new User(
                                doc.data()['name'],
                                doc.data()['age'],
                                doc.data()['email'],
                                doc.data()['password'] );
                    
                    if(tempUser.matches(u.email)){
                        throw 'Break';
                    }
                }
                
            });

            // if(tempUser.matches(u.email)){
            //     return tempUser.login(u.password);
            // }                  

            throw new Error(`${u.email} doesn't exist!`);
        }
        catch(e){
            if(e === 'Break'){
                return tempUser.login(u.password);
            }
            console.log(e.message);
            return {success: false, data: `${e.message}`};
        }

    }
    
}