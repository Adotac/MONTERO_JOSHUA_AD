import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    helloWorld(name:string): string {
        var randomSentence = [ "Hello World! " + name + " has been born!",
            "Hi there, " + name+"...", "Its not that I like "+name+" or something, or anything... bakaa!!","What are you doing here " + name + "?",
            "Which will you take " + name + ", red pill or blue pill?", "Don't worry "+name+" you're also someone's little pogchamp.",
            "What did you eat today "+name+"?", "How was your day "+name+"?"];

        return randomSentence[Math.floor(Math.random()*randomSentence.length)];
    }

    loopsTriangle(height:number): string {
        var str = ""; 
        var str2 = "";
        for(var i = 0; i < height; i++){
            for(var j = 0; j <= i; j++){
                str += `${"*"}`;
                str2 += `${"*"}`;
            }
            str += `${"<br>"}`;
            str2 += `${"\n"}`;
        }
    
        if(height > -1) {
            console.log(str2);
            return str;
        }
        else {
            console.log("\nInput out of range!\n"); 
            return "\nInput out of range!\n";
        }
    }

    primeNumber(num:number): string{
        var primeflag = false;
        var factorsCtr = 0;
        var factors = [];
        for(var i = 1; i < num; i++){
            if(num % i == 0 && num != 1){
                factors[factorsCtr] = i;
                factorsCtr++; //counts the number of factors the number have
            }
        }
        
        if(factorsCtr == 1)
            primeflag = true;
        
        if(primeflag)
            return "The number [ "+num+" ] you entered is a prime number!";
        else
            return "The number [ "+num+" ] you entered is not a prime number!"
                    + "<br>The factors are: " + factors;

    }
}
