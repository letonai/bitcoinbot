//CI TEST3
const request = require('request-promise')
const Telegraf = require('telegraf');
const { reply } = Telegraf;
const { Markup,Extra } = Telegraf


var fs = require('fs');

var obj = JSON.parse(fs.readFileSync('./apikey.secret', 'utf8'));
const bot = new Telegraf(obj.secret);
console.log(process.version.match(/^v(\d+\.\d+)/)[1])



bot.startPolling();

/*Telegram Options*/
bot.catch((err) => {
  console.log('Ooops', err)
})

//Actions
// bot.command('/bitcoin',(ctx) => btc(ctx));
bot.command('/cota',(ctx) => cota(ctx) );

bot.on('callback_query',ctx => {
    coinRequested = ctx.update.callback_query.data;
    request("http://localhost:8990/"+coinRequested).then(function (body) {
      // console.log(body);
      // let coin=JSON.parse(body);
      // var coinValue=parseFloat(coin[coinRequested].usd);
      // if(coinValue<0.01){
      //   coinValue=parseFloat(coinValue).toFixed(8);
      // }else{
      //   coinValue=parseFloat(coinValue).toFixed(2);
      // }
      ctx.reply(body+" USD");
    }).catch(function (err) {
      console.error("Erro XXX: "+err);
    })
 
  });

function cota(ctx){
  let  btMenu = [];
  btMenu.push(Markup.callbackButton("BTC", 'bitcoin'));
  btMenu.push(Markup.callbackButton("XRP", 'ripple'));
  btMenu.push(Markup.callbackButton("LTC", 'litecoin'));
  ctx.reply("Moedas:",Markup.inlineKeyboard(btMenu).extra());
}
