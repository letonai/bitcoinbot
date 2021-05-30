const request = require('request-promise')
var http = require('http');
const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./db/exchange.sql', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the exchange SQlite database.');
});

function getExchangeData(symbol,httpReq){
  const coingecko = {
    method: 'GET',
    uri: 'https://api.coingecko.com/api/v3/simple/price?ids='+symbol+'&vs_currencies=USD', 
    // uri: 'https://api.coingecko.com/api/v3/exchange_rates',
    headers: {
      'accept': 'application/json'
    }
  };

    request(coingecko).then(function (body) {
      value=JSON.parse(body)[symbol].usd
      let text=symbol+" $"+value;
      getLastExchangeData(symbol).then((x)=>{
      
      if (x.last_price<value ){
          text+=" ↗️ ";
          insertExchangeData(symbol,value,new Date());
      }else if (x.last_price>value ){
          text+=" ⬇️ ";
          insertExchangeData(symbol,value,new Date());
      }
      
      text=(variance(x.last_price,value,3)==0?text:text+=variance(x.last_price,value,3)+"%")
      respond(text,httpReq);
      console.log(text);
      text=undefined;

      }).catch((err)=>{console.log(err)});
    }).catch(function (err) {
      console.error("Erro coinmarketcap: "+err);
    })    
}

function variance(termA,termB,fix){
  console.log("termA:"+termA+" termB: "+termB);
  return (100-((termA/termB)*100)).toFixed(fix);
}

function respond(text,httpReq){
  httpReq.writeHead(200, {'Content-Type': 'text/plain'});
  httpReq.write(text);
  httpReq.end();
}

function insertExchangeData(symbol,last_price,last_update){
  let stmt = db.prepare("INSERT INTO currency (symbol,last_price,last_update) VALUES (?,?,?)");
  stmt.run([symbol,last_price,last_update]);
  stmt.finalize();
}

function getLastExchangeData(symbol){
  let stmt = "select last_price from currency where symbol=? and id=(select max(id) from currency where symbol=?)" 
  return new Promise((resolve,reject)=>{
    db.get(stmt,symbol,symbol,(err,row)=>{
    if(err){
      reject("ERROR: "+err.message);
      
    }
    if(
      row == undefined){
      row="{"+symbol+":{\"usd\":0}}\"}";
      insertExchangeData(symbol,0,new Date());
    }
    resolve(row);
  });
});
}

// getExchangeData();
// setInterval(function(){
//     getExchangeData();
// },60000);

http.createServer(function (req, res) {
  console.log(req.url.replace('/',''));
  getExchangeData(req.url.replace("/",""),res);
}).listen(8990);
