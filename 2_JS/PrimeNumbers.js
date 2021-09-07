/*
Before running this script on terminals/console.
Make sure you have the "node_modules" on the same folder of the script.

You can also install the module on the same directory with this command:

    npm install prompt
*/

const prompt = require('prompt');
prompt.start();

var num = { 
    description: 'Input a number',
    name: 'num', 
    type: 'integer',
    warning: 'Invalid Input!' 
};
var primeflag = false;
var factorsCtr = 0;

prompt.get(num, function(err, result) {
    if (err) { return onErr(err); }  

    for(var i = 1; i < result.num; i++){
        if(result.num % i == 0 && result.num != 1)
            factorsCtr++; //counts the number of factors the number have
    
        if(factorsCtr > 1)
            break;
    }
    
    if(factorsCtr == 1)
        primeflag = true;
    
    console.log(`\n${result.num} is a prime number?\n${primeflag}`);
    
});

function onErr(err) {
    console.log(err);
    return 1;
}