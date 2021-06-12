const request = require('request-promise')
const Telegraf = require('telegraf');
const { reply } = Telegraf;
const { Markup,Extra } = Telegraf
var fs = require('fs');
const { exit } = require('process');

var key = JSON.parse(fs.readFileSync('./apikey.secret', 'utf8'));
var menuConfig = JSON.parse(fs.readFileSync('./menu.conf', 'utf8'));
registerMenus(menuConfig);

const bot = new Telegraf(key.secret);
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
      ctx.reply(body+" USD");
    }).catch(function (err) {
      console.error("Erro XXX: "+err);
    })
 
  });

function registerMenus(jsonConfig){
  let  btMenu = [];
  jsonConfig["menu"].forEach(element => {
    btMenu.push(btMenu.push(Markup.callbackButton(element.symbol, element.name)));
  });
  return btMenu;
}


function cota(ctx){
  ctx.reply("Moedas:",Markup.inlineKeyboard(registerMenus(menuConfig)).extra());
}
