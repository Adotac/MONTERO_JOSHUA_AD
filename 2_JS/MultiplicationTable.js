var str = "";
var tableMax = 10;

for(var i = 1; i <= tableMax; i++){
    for(var j = 1; j <= tableMax; j++){
        str += `${i*j}`;
        str += `${"\t"}`;
    }
    str += `${"\n"}`;
}

console.log(str);