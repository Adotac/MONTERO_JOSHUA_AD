export class User {
    private _id: string;
    public set id(value: string) {this._id = value;}
    public get id(): string {return this._id;}

    private _name: string;
    public get name(): string {return this._name;}
    public set name(value: string) {this._name = value;}

    private _age: number;
    public get age(): number {return this._age;}
    public set age(value: number) {this._age = value;}

    private _email: string;
    public get email(): string {return this._email;}
    public set email(value: string) {this._email = value;}

    private _password: string;
    public set password(value: string) {this._password = value;}

    constructor(_id:string,
                _name:string,
                _age:number,
                _email:string,
                _password:string){

        this._id=_id;
        this._name=_name;
        this._age=_age;
        this._email = _email;
        this._password = _password;
    }


    public toJson(){
        return {
            id: this.id,
            name:this.name,
            age: this.age,
            email: this.email
        }
    }

}