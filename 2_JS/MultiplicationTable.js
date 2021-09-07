/*
Before running this script on terminals/console.
Make sure you have the "node_modules" on the same folder of the script.

You can also install the module on the same directory with this command:

    npm install prompt
*/

const prompt = require('prompt');
var colors = require("colors/safe");
prompt.start();


var str = "\n";
var tableMax = { 
    description: 'Input the size of table',
    name: 'tableMax', 
    type: 'integer',
    warning: 'Invalid Input!' 
};

prompt.get(tableMax, function(err, result) {
    if (err) { return onErr(err); }  

    for(var i = 1; i <= result.tableMax; i++){
        for(var j = 1; j <= result.tableMax; j++){
            str += `${i*j}`;
            str += `${"\t"}`;
        }
        str += `${"\n"}`;
    }
    if(result.tableMax === 0){console.log(result.tableMax)}
    else if(result.tableMax >= 1) {console.log( colors.inverse(str) );}
    else {console.log("\nInput out of range!\n");}
    
});

function onErr(err) {
    console.log(err);
    return 1;
}