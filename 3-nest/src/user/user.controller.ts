import { Controller, Get , Param, Post, Put, Patch, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get("/")
    mstate(){
        this.userService.populate();
        return this.userService.getAll();
    }

    @Get("/all") // return all users
    getAll(){
        return this.userService.getAll();
    }

    @Post("/register")
    goRegister(@Body() body: any): boolean{      
        try {
            return this.userService.register(body);
        } catch (e) {
            console.log(e); return false; 
        }  
        
    }

    @Get("/:id")
    getID(){
        return this.userService.getAll();
    }

    @Put("/:id")
    setID(){
        return this.userService.getAll();
    }

    @Patch("/:id")
    modifyID(){
        return this.userService.getAll();
    }

    @Delete("/:id")
    deleteID(){
        return this.userService.getAll();
    }

    @Post("/login")
    login(){
        return this.userService.getAll();
    }

    @Get("/search/:term")
    search(@Param('term')term:string): string{

        return "";
    }
}