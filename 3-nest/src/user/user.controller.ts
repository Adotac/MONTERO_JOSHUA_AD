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
    goRegister(@Body() body: any){      
        return this.userService.register(body);
    }

    @Get("/:id")
    getID(@Param('id')id:string){
        return this.userService.getUser(id);
    }

    @Put("/:id")
    putD(@Body() body: any, @Param('id')id:string){
        return this.userService.putData(id, body);
    }

    @Patch("/:id")
    patchD(@Param('id')id:string, @Body() body: any){
        return this.userService.patchData(id, body);
    }

    @Delete("/:id")
    deleteID(@Param('id')id:string){
        return this.userService.deleteUser(id);
    }

    @Post("/login")
    login(@Body() body: any){
        return this.userService.loginUser(body);
    }

    @Get("/search/:term")
    search(@Param('term')term:string){
        return this.userService.searchTerm(term);
    }
}