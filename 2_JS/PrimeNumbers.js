var num = 6;

var primeflag = false;
var factorsCtr = 0;
for(var i = 1; i < num; i++){
    if(num % i == 0 && num != 1)
        factorsCtr++; //counts the number of factors the number have

    if(factorsCtr > 1)
        break;
}

if(factorsCtr == 1)
    primeflag = true;

console.log(`${num} is a prime number?\n${primeflag}`);