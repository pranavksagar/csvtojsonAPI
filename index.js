const express = require('express');
const app = express();

const fs = require("fs");
csv = fs.readFileSync("addresses.csv");
 
var arr = csv.toString().split("\r");
 
let headers = arr[0].split(", ");

let ob = {};

const insert = function(ob,props){
    if(props.length == 0) return;
    var s = props[0]
    if(s in ob){
        insert(ob[s],props.slice(1));
    }
    else{
        ob[s] = {};
        insert(ob[s],props.slice(1));
    }
    return;
}

const insertProp = function(obj,s,currProp){
    if(currProp.length == 1){
        obj[currProp[0]] = s;
        return;
    }
    
    insertProp(obj[currProp[0]],s,currProp.slice(1));
}

for(let j = 0; j < headers.length; j++){
    let s = headers[j];
    let props = s.split(".");
    insert(ob,props);
}

let result = [];

for(let i = 1; i < arr.length-1; i++) {
  let obj = JSON.parse(JSON.stringify(ob));
  let str = arr[i];
  let properties = str.split(", ");
  for(let j = 0; j < properties.length; j++){
      properties[j] = properties[j].trim();
      var s = properties[j];
      let currProp = headers[j].split(".");
      insertProp(obj,s,currProp);
  }
 // console.log(obj);
  result.push(obj);
}
console.log(result);

let ans = JSON.stringify(result,null,2);

fs.writeFileSync('output.json', ans);

app.get('/',(req,res)=>{
    res.send(ans);
});

 app.listen(3000, ()=>{console.log('On port 3000...')});