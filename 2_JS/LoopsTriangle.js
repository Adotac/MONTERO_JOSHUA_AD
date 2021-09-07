/*
Before running this script on terminals/console.
Make sure you have the "node_modules" on the same folder of the script.

You can also install the module on the same directory with this command:

    npm install prompt
*/

const prompt = require('prompt');
var colors = require("colors/safe");
prompt.start();

const height = { 
    description: 'Input the height of triangle',
    name: 'height', 
    type: 'integer',
    warning: 'Invalid Input!' 
};
var string = '\n';

prompt.get(height, function(err, result) {
    if (err) { return onErr(err); }  

    for(var i = 0; i < result.height; i++){
        for(var j = 0; j <= i; j++){
            string += `${"*"}`;
        }
        string += `${"\n"}`;
    }

    if(result.height > -1) {console.log( colors.green(string) );}
    else {console.log("\nInput out of range!\n");}
    
});



function onErr(err) {
    console.log(err);
    return 1;
}