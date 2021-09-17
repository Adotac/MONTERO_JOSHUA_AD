import { Controller, Get , Param, Post, Put, Patch, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}


    @Post("/register")
    goRegister(@Body() body: any){      
        return this.userService.register(body);
    }

    @Get("/all") // return all users
    getAll(){
        return this.userService.getAllUsers();
    }

    @Get("/:id")
    retrieveUser(@Param('id')id:string){
        return this.userService.getUser(id); 
    }

    @Get("/search/:term")
    search(@Param('term')term:string){
        return this.userService.searchUser(term);
    }

    @Put("/:id")
    putD(@Body() body: any, @Param('id')id:string){
        return this.userService.replacePut(body, id);
    }

    @Patch("/:id")
    patchD(@Param('id')id:string, @Body() body: any){
        return this.userService.replacePatch(body, id);
    }

    @Delete("/:id")
    deleteID(@Param('id')id:string){
        return this.userService.deleteUser(id);
    }

    @Post("/login")
    login(@Body() body: any){
        return this.userService.loginUser(body);
        return false;
    }

    
}