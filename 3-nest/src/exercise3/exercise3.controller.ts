import { Controller, Get, Param } from '@nestjs/common';
import { Exercise3Service } from './exercise3.service';

@Controller('exercise3')
export class Exercise3Controller {
    constructor(private readonly e3: Exercise3Service){}

    @Get("/hello/:name")
    getHello(@Param('name') name:string): string {
        return this.e3.helloWorld(name);
    }

    @Get("/loopsTriangle/:height")
    getTriangle(@Param('height') height:string ): string {
        var parsedHeight = parseInt(height);
        return this.e3.loopsTriangle(parsedHeight);
    }

    @Get("/prime/:num")
    primeNum(@Param('num') num:number): string {
        return this.e3.primeNumber(num); 
    }
}

