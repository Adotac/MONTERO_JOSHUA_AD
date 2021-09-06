var height = 15;
var string = '';
for(var i = 0; i < height; i++){
    for(var j = 0; j <= i; j++){
        string += `${"*"}`;
    }
    string += `${"\n"}`;
}
console.log(string); 