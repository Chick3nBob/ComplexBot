const Discord = require('discord.js');
const economy = require('discord-eco');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const moment = require('moment');
const sql = require("sqlite");
var Canvas = require('canvas');
const chalk = require('chalk');
sql.open("./score.sqlite");
const config = require("./config.js");
const ms = require("ms");
const ytdl = require('ytdl-core');
const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();
const bot = new Discord.Client();

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");  
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 2800);

const tableSource = new EnmapLevel({name: "descriptions"});
const descriptions = new Enmap({provider: tableSource});
bot.descriptions = new Enmap({name: "descriptions"});

const newUsers = [];
const queues = {};
const nowplaying = {};
var servers = {};
var guilds = {};
const modRole = 'Bot Creator'


let userData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));
let levelData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));
let points = JSON.parse(fs.readFileSync("Storage/points.json", "utf8"));

function Role(mem, role) {
  return mem.roles.some(r=> r.name.toLowerCase() === role.toLowerCase());
  }

function clean(text) {
  if(typeof(text) === "string")
  return text.replace(/`/g, "`" + String.froCharCode(8203)).replace(/@/g, + String.froCharCode(8203));
  else
    return text;
}

function addRole(role) {
  if (!(role instanceof Role)) role = this.guild.roles.get(role);
  if (!role) throw new TypeError('Supplied paraeter was neither a Role nor a Snowflake.');
  return this.bot.rest.ethods.addmemberRole(this, role);
}


function uptime() {
    var date = new Date(bot.uptime);
    var strDate = '';
     strDate += date.getUTCDate() - 1 + " Days, ";
    strDate += date.getUTCHours() + " Hours, ";
    strDate += date.getUTCMinutes() + " Minutes, ";
    strDate += date.getUTCSeconds() + " Seconds";
    return strDate;
}


const defaultSettings = {
  prefix: "cn!",
  adminRole: "Administrators",
  modRole: "Moderator",
  modLogChannel: "mod-logs",
  welcomemsg: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D"
} // Sets the mod log, change it to whatever you like


bot.on('ready', () => {
  bot.user.setGame('cn!commands | In ' + bot.guilds.size + " Servers")
  console.log("Ready to be in all the Community servers: " + bot.guilds.size);
});

bot.on("disconnected", () => {
	console.log("Disconnected!");
});


bot.on('message', message => {
   try{
      if (!guilds[message.guild.id]) {
          guilds[message.guild.id] = {
              prefix: "cn!",  // default prefix, change it to fit your needs
          };
      }
  } catch (e) {
    console.log(e);
  }

  if (message.author.bot) return; // ignore any bots
  const prefix = guilds[message.guild.id].prefix; // multi-guild (will come back to this later)
  const args = message.content.split(" ");
  let command = args[0];
  command = command.slice(prefix.length);
  if(!message.content.startsWith(prefix)) return; // ignore messages without a prefix
  if(message.channel.type === 'dm') return message.reply("You cant use me in PM."); // prevent commands via dm
  
  sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) {
      sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
    } else {
      let curLevel = Math.floor(0.2 * Math.sqrt(row.points + 1));
      if (curLevel > row.level) {
        row.level = curLevel;
        sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
        economy.updateBalance(message.author.id, 250).then((i) => {
          var embed = new Discord.RichEmbed()
          .setTitle("Leveled Up")
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setColor('RANDOM')
          .setDescription("You have now leveled up to " + curLevel + " and $250 has been added to your balance.")
          .addField("New Balance", "Your new balance is " + i.money)
          return message.channel.send(embed)
      })
      }
      sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
    }
  }).catch(() => {
    console.error;
    sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
      sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
    });
  });


  if(message.channel.id === '371830206572265472') {
  if (isNaN(message.content)) {
    message.delete()
    message.author.send(`Please only post your client's ID.`)
  }
}
  
   if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };
  let userData = points[message.author.id];
  pointz = userData.points
  
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  let serDataa = (curLevel + 1);
      let serDatab = (serDataa / 0.1);
      let serDatac = (serDatab * serDatab);
      opointz = serDatac
  levl = curLevel
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`You’ve leveled up to level **${curLevel}**.`);
  }

  
  if (!userData[message.author.id + message.guild.id]) userData[message.author.id + message.guild.id] = {}
if (!userData[message.author.id + message.guild.id].money) userData[message.author.id + message.guild.id].money = 1000;
if (!userData[message.author.id + message.guild.id].lastDaily) userData[message.author.id + message.guild.id].lastDaily = 'Not Collected';
  
fs.writeFile("Storage/userData", JSON.stringify(userData), (err) => {
    if (err) console.error(err);
})
  
          if (!levelData[message.author.id]) levelData[message.author.id] = {
            messagesSent: 0
        }

        levelData[message.author.id].messagesSent++;

        fs.writeFile('Storage/userData', JSON.stringify(levelData), (err) => {
            if (err) console.error(err);
        })
  

if (command === 'purge') {
    let messagecount = parseInt(result);
    message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
  } else

  if(command === "kick") {
    let modRole = message.guild.roles.find("name", "Staff");
    const op = message.guild.channels.find('name', 'mod-logs');
    if(message.member.roles.has(modRole.id)) {
      let kickmember = message.guild.member(message.mentions.users.first());

       if(!message.member.roles.has(modRole.id)) {
         var embed = new Discord.RichEmbed()
         .setDescription(":x: No access :x:")
         .addField("Info", message.author.username + " You need to have <Staff> role ")
         .setColor(0xff5148)
        return  message.channel.send(embed);
       }

       if(message.mentions.users.size === 0){
        var embed = new Discord.RichEmbed()
        .setDescription(":x: You need to mention user :x:")
        .addField("Info", "cn!kick <User> <reason>")
        .setColor(0xff5148)
        return message.channel.send(embed);
      }


      let areason = args.slice(2).join(' ');

        if(!areason){
         var embed = new Discord.RichEmbed()
          .setDescription(":x: You need to mention reason  :x:")
          .setColor(0xff5148)
          .addField("Info", "Please indicate a reason for the kick!")
          .addField("Command info", "cn!kick <user> <reason>")
          return message.channel.send(embed);
      }

      message.guild.member(kickmember).kick();
      var embed = new Discord.RichEmbed()
      .setDescription(":white_check_mark: Sucess :white_check_mark:")
      .addField("Info", kickmember + " has been kicked for\n" + "```" + areason + "```")
      .setColor(0xff5148)
     return op.send(embed);
    }
    }


   if(command === "rban") {
  if(message.content.length > 4 + process.env.PREFIX.length) return;
  if(message.isMentioned("365143848571371521")) {
    return message.channel.send("```" + "You can not request a global ban on itself" + "```").catch(console.error);
  }
  if(message.isMentioned("228349229230325760")) {
    return message.channel.send("```" + "You can not request a global ban on the bot creator" + "```").catch(console.error);
  }
  if(message.mentions.users.size === 0) {
    return message.channel.send("**Invalid command Use**\n```Please ention a User Next Tie```").catch(console.error);
  }
  if(message.mentions.users.size > 1) {
    return message.channel.send("**Invalid command Use**\n```Please do not ention so any users next tie```").catch(console.error);
  }
  if(args.length === 1) {
    message.channel.send("What was that? I didn't quite understand what you put.").catch(console.error);
  } else {
    if(!args[1].includes('@')) {
      return message.channel.send("**Invalid command Use**\n```Usage: cn!rban <user> <reason>```").catch(console.error);
    } else {
      if(args[1].length <=1) {
        return message.channel.send("**Invalid command Use**\n```Usage: cn!rban <user> <reason>```").catch(console.error);
      } else {
    if(args.slice(2).join(' ').length === 0) {
      message.channel.send("**Invalid command Use**\n```Please give a reason on why you want to request this person on the global banned list```").catch(console.error);
    } else {
      message.channel.send( message.mentions.users.first() + ' has been requested to be put on the banned list for ' + args.slice(2).join(' '));
      message.mentions.users.first().send('You have been requested to be placed on the global banned list ' + args.slice(2).join(' ') + ' ` on ' + message.guild.name + ' Please refrain fro doing it again.').catch(console.err);
    }
  }
}
  }
} else

if (command === "ban") {
  let modRole = message.guild.roles.find("name", "Staff");
  const op = message.guild.channels.find('name', 'mod-logs');
  if(message.member.roles.has(modRole.id)) {
    let banMember = message.guild.member(message.mentions.users.first());

     if(!message.member.roles.has(modRole.id)) {
       var embed = new Discord.RichEmbed()
       .setDescription(":x: No access :x:")
       .addField("Info", message.author.username + " You need to have <Staff> role ")
       .setColor(0xff5148)
      return  message.channel.send(embed);
     }

     if(message.mentions.users.size === 0){
      var embed = new Discord.RichEmbed()
      .setDescription(":x: You need to mention user :x:")
      .addField("Info", "cn!ban <User> <reason>")
      .setColor(0xff5148)
      return message.channel.send(embed);
    }


    let areason = args.slice(2).join(' ');

      if(!areason){
       var embed = new Discord.RichEmbed()
        .setDescription(":x: You need to mention reason  :x:")
        .setColor(0xff5148)
        .addField("Info", "Please indicate a reason for the ban!")
        .addField("Command info", "cn!ban <user> <reason>")
        return message.channel.send(embed);
    }

    message.guild.member(banMember).ban();
    var embed = new Discord.RichEmbed()
    .setDescription(":white_check_mark: Sucess :white_check_mark:")
    .addField("Info", banMember + " has been banned for\n" + "```" + areason + "```")
    .setColor(0xff5148)
   return op.send(embed);
  }
  }

if(command === "server") {
  if(message.content.length > 6 + process.env.PREFIX.length) return;
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription("These are all my server moderate commands. More will soon be added in as we grow as a Comunnity/Nation")
    .addField("cn!rolecreate", "Adds a default role called `new role`")
    .addField("cn!delchann", "Deletes the channel that you say command in.")
    .addField("cn!makechann", "Makes a fresh new channel called `hi`")
    .addField("cn!gn", "Changes the name of the Guild.")
    .addField("cn!myperms", "Shows you all the server permissions you have.")
    .addField("cn!setname", "Changes your user name even thoe you can do that yourself Mr./Mrs. Lazy")
   return message.channel.send(embed);
}

  if (command === 'iqp') {
    let count = 0;
    let ecount = 0;
    for(let x = 0; x < 4000; x++) {
      message.channel.send(`this is message ${x} of 3999`)
        .then(m => {
          count++;
          console.log('reached', count, ecount);
        })
        .catch(m => {
          console.error(m);
          ecount++;
          console.log('reached', count, ecount);
        });
    }
  }

  if(command === "restart") {
    if(message.author.id !== '228349229230325760') return;
    message.channel.send("Shutting down...")
    process.exit(1337);
  }
  
  if(command === "money") {
    message.channel.send(userData[message.author.id + message.guild.id].money)
}

   if(command === "warn") {
     let member = message.mentions.members.first();
     const op = message.guild.channels.find('name', 'mod-logs');
     let modRole = message.guild.roles.find("name","Staff")

     if(!modRole) {
       message.channel.send("You need to have a `Staff Role` and a `mod-logs` in your server to use the mod commands.")
     }


     if(!message.member.roles.has(modRole.id)){
       var embed = new Discord.RichEmbed()
       .setDescription(":x: No access :x:")
       .addField("Info", message.author.username + " You need to have <Staff> role ")
       .setColor(0xff5148)
      return  message.channel.send(embed);
     }



     if(message.mentions.users.size === 0){
       var embed = new Discord.RichEmbed()
       .setDescription(":x: You need to mention user :x:")
       .addField("Info", "cn!warn <User> <reason>")
       .setColor(0xff5148)
       return message.channel.send(embed);
     }


     let areason = args.slice(2).join(' ');

       if(!areason){
        var embed = new Discord.RichEmbed()
         .setDescription(":x: You need to mention reason  :x:")
         .setColor(0xff5148)
         .addField("Info", "Please indicate a reason for the ban!")
         .addField("Command info", "cn!warn <user> <reason>")
         return message.channel.send(embed);
     }




     var embed = new Discord.RichEmbed()
     .setDescription(":x: Warning :x:")
     .setColor(0xff5148)
     .addField("Info", member +  " you have been warned for\n" + "```" +  areason + "```")
     .addField("By", message.author.username)
     op.send(embed);
   }




   if(command === "hug") {
     if(args[0].length > 4 + process.env.PREFIX.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not mention a user to hug. Usage: `' + `${process.env.PREFIX}hug <@User to hug>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You mentioned too any users to hug. Usage: `' + `${process.env.PREFIX}hug <@User to hug>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not mention a user to hug. Usage: `' + `${process.env.PREFIX}hug <@User to hug>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not mention a user to hug. Usage: `' + `${process.env.PREFIX}hug <@User to hug>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(message.member.user + ' just hugged ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "stab") {
     if(args[0].length > 4 + process.env.PREFIX.length) return;
       if(message.mentions.users.size === 0) {
             return message.channel.send(message.member.user + ' just stabbed theselves :scream:').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too any users to stab. Usage: `' + `${process.env.PREFIX}stab <@User to hug>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention a user to stab. Usage: `' + `${process.env.PREFIX}stab <@User to hug>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a user to stab. Usage: `' + `${process.env.PREFIX}stab <@User to hug>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':scream:' + message.member.user + ' just stabbed ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "shoot") {
     if(args[0].length > 5 + process.env.PREFIX.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not mention a user to shoot. Usage: `' + `${process.env.PREFIX}shoot <@User to shoot>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too any users to shoot. Usage: `' + `${process.env.PREFIX}shoot <@User to shoot>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not mention a user to shoot. Usage: `' + `${process.env.PREFIX}shoot <@User to shoot>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not mention a user to shoot. Usage: `' + `${process.env.PREFIX}shoot <@User to shoot>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':scream:' + message.member.user + ' just :gun: shot ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "kiss") {
     if(args[0].length > 5 + process.env.PREFIX.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not ention a user to kiss. Usage: `' + `${process.env.PREFIX}kiss <@User to kiss>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You entioned too any users to kiss. Usage: `' + `${process.env.PREFIX}kiss <@User to kiss>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not ention a user to kiss. Usage: `' + `${process.env.PREFIX}kiss <@User to kiss>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not ention a user to kiss. Usage: `' + `${process.env.PREFIX}kiss <@User to kiss>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':open_mouth: :kiss:http://i.igmur.com/HvziYWb.gif ' + message.member.user + ' just kissed ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "marry") {
     if(args[0].length > 5 + process.env.PREFIX.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not ention a user to arry. Usage: `' + `${process.env.PREFIX}arry <@User to kiss>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You entioned too any users to arry. Usage: `' + `${process.env.PREFIX}arry <@User to kiss>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not ention a user to arry. Usage: `' + `${process.env.PREFIX}arry <@User to kiss>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not ention a user to arry. Usage: `' + `${process.env.PREFIX}arry <@User to kiss>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':open_mouth: :kiss:OG GUYS COE QUICK!! ' + message.member.user + ' WANT TO MARRY! ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "kill") {
     if(args[0].length > 5 + process.env.PREFIX.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not ention a user to kill. Usage: `' + `${process.env.PREFIX}kill <@User to kill>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You entioned too any users to ki;;. Usage: `' + `${process.env.PREFIX}kill <@User to kill>` + '`').catch(console.error);
       } else

         if(!args[1].includes('@')) {
           return message.channel.send('You did not ention a user to kill. Usage: `' + `${process.env.PREFIX}kill <@User to kill>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not ention a user to kill. Usage: `' + `${process.env.PREFIX}kill <@User to kill>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':scream:' + message.member.user + ' just killed  ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "hi") {
     if(message.content.length > 2 + process.env.PREFIX.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else

   if (command === "eval") {
     if(message.author.id !== '228349229230325760' ) return;
      try {
        const com = eval(message.content.split(" ").slice(1).join(" "));
        message.channel.send('```\n' + com + '```');
      } catch(e) {
        message.channel.send('```js\n' + e + '```');
      }
    }


if(command === "help") {
  var embed = new Discord.RichEmbed()
  .setTitle("Help Commands")
  .setColor('RANDOM')
  .setDescription("So you are trying to get all my commands??\nUse `cn!commands for more info`")
  .addField("All:", "**cn!info ( My info )\ncn!invite ( Invites me to your server )\ncn!help ( Helps this message )\ncn!commands ( To get all my commands )**\nIf a command doesn't goes thru, then that means the bot needs permissions for it.")
 return message.channel.send(embed);
}

if (command === "dice") {
  let toSay = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
  let choice = toSay[Math.floor(Math.random() * toSay.length)];
  message.channel.send(choice);
}

if(command === "8ball") {
  let ball = ["Yes", "YOU KNOW IT!", "You a dingus", "Not that I think so", "Nope", "So true", "21", "Sorry what was that?", "Please say that again", "I do not think that is good", "You right, YEET!", "Idk", "Ofc"];
  let choice = ball[Math.floor(Math.random() * ball.length)];
  var embed = new Discord.RichEmbed()
  .setDescription(choice)
  return message.channel.send(embed)
}
  
  if(command === "test 2") {
    message.channel.send("Spacing command")
  }
  
  if (command === "level") {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("Your current level is 0");
      message.reply(`Your current level is ${row.level}`);
    });
  } else

  if (command === "points") {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("sadly you do not have any points yet!");
      message.reply(`you currently have ${row.points} points, good going!`);
    });
  }
  

  

if(command === "payday") {
  if(message.author.id !== '228349229230325760' ) return message.channel.send("This command is not ready for the public.")
    economy.updateBalance(message.author.id, 250).then((i) => {
        message.channel.send("**You got $250!**\n**NEW BALANCE:** " + i.money)
    })
}

if(command === "payfine") {
  if(message.author.id !== '228349229230325760' ) return message.channel.send("This command is not ready for the public.")
    economy.updateBalance(message.author.id, -10000).then((i) => {
        message.channel.send("**You paid $500 fine!**\n**NEW BALANCE:** " + i.money)
      
      if(i.money === 0) {
        message.channel.send("You have no more money. Please wait until it's payday time.")
    }
})
}
  
  if(command === "queue") {
               var iconurl = bot.user.avatarURL;
            if (nowplaying[message.guild.id]) {
                var video = nowplaying[message.guild.id];
                var server = servers[message.guild.id];
                var desc = `**Now Playing:**\n${video.title}\n\n`;
                for (var i = 0; i < server.queue.length; i++) {
                    if (i == 0) {
                        desc = desc + "**Queue:**\n";
                        desc = desc + `**${i + 1}.** ${server.queue[i].title}\n`;
                    }
                    else {
                        desc = desc + `**${i + 1}.** ${server.queue[i].title}\n`;
                    }
                }
                var embed = new Discord.RichEmbed()
                    .setAuthor("Music", iconurl)
                    .setColor([0, 255, 0])
                    .setDescription(desc)
                message.channel.send(embed);
            }
            else {
                var embed = new Discord.RichEmbed()
                    .setAuthor("Music", iconurl)
                    .setColor([0, 255, 0])
                    .setDescription("No music is playing.")
                message.channel.send(embed);
            }
  }
  
  if(command === "shop1") {
    economy.updateBalance(message.author.id, -250).then((i) => {
      message.channel.send("You have paid for a chicken wing. You now have \n" + i.money)
  })
  }
  
  if(command === "donate") {
    economy.updateBalance(message.author.id, +10000).then((i) => {
      message.channel.send("Thanks for wanting to donate to the bot. $10000 has been added to your balance.\n**NEW BALANCE: " + i.money + "**")
      message.author.send("Donate Here: https://paypal.me/chick3nbob\nJoin Here: https://discord.gg/XyU82fe")
  })
  }
	
  if(command === "desc") {
	  if(!bot.descriptions.get(message.author.id)){
	bot.descriptions.set(message.author.id, "No Description");
 }

const args = message.content.split(" ").slice(1);
const description = args.join(" ");

var testt = bot.descriptions.get(message.author.id);

testt = description;

bot.descriptions.set(message.author.id, testt);

var test = bot.descriptions.get(message.author.id);
message.reply("Your description has been updated successfully.");

}
  
  if (command === "setprefix") {
  if (!message.member.hasPermission("SPEAK")) return message.channel.send(`__**Access Denied**__\nYou must have __MANAGE_GUILD__ perms to use this command.`); // Checks for permissions to change the prefix
  const newPrefix = args.slice(1).join(" "); // define the prefix
  guilds[message.guild.id].prefix = newPrefix; // set the prefix
  message.channel.send(`The prefix for **${message.guild.name}** is now **${newPrefix}**`); // reply with the new sexy prefix!
    
}
  

if(command === "ship") {
  let first = message.mentions.members.first();
  let mention = message.mentions.users.first();
  let ship = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", '17', '18', '19', '20', '21', '22', '23', '24', '25',	'26',	'27',	'28',	'29',
  '30',	'31',	'32',	'33',	'34',	'35',	'36',	'37',	'38',	'39',
  '40', '41',	'42',	'43',	'44',	'45',	'46',	'47',	'48',	'49',
  '50',	'51',	'52',	'53',	'54',	'55',	'56',	'57',	'58',	'59',
  '60',	'61',	'62',	'63',	'64',	'65',	'66',	'67',	'68',	'69',
  '70',	'71',	'72',	'73',	'74',	'75',	'76',	'77',	'78',	'79',
 '80',	'81',	'82',	'83',	'84',	'85',	'86',	'87',	'88',	'89',
  '90',	'91',	'92',	'93',	'94',	'95',	'96',	'97',	'98',	'99',
  '100'	];
  let love = ship[Math.floor(Math.random() * ship.length)];

  if(!first) {
  message.channel.send("Please mention a user.")
  }

  message.channel.send("**MATCH MAKING ON POINT**\n:inbox_tray: `" + mention.tag + "`\n:inbox_tray: `" + message.author.tag + "`")
  var embed = new Discord.RichEmbed()
  .setDescription(":heart: " + love + "%")
  return message.channel.send(embed)
}
  
  if(command === "daily") {
    if (userData[message.author.id + message.guild.id].lastDaily != moment().format('L')) {
        userData[message.author.id + message.guild.id].lastDaily = moment().format('L')
        userData[message.author.id + message.guild.id].money += 500;
        var embed = new Discord.RichEmbed()
        .setTitle("Daily Reward")
        .setDescription("You got $500 added to your bank!")
        return message.channel.send(embed)
    } else {
        message.channel.send("You have already collected your daily reward. Next will be avaible at " + moment().endOf('day').fromNow())
    }
}
  
  if(command === "top") {
        var channel = message.channel.id;
        var i = 1;
       var  lb = [];
        let mm = message.channel.send('Please wait a moment..');
     sql.each(`SELECT * FROM scores ORDER BY points DESC LIMIT 10`, (err, row) =>{
        let curLevel = row.level
        let serDataa = (curLevel + 1);
        let serDatab = (serDataa / 0.2);
        let serDatac = (serDatab * serDatab);    
          lb.push(`${i++}. <@${row.userId}> - Level: ${row.level}, Points: ${row.points}/${serDatac}`);
})
setTimeout(() => {
              let embed = new Discord.RichEmbed()
              .addField("Leaderboard", `Top 10\n${lb.join("\n\n")}`)  
              console.log(lb)
              message.channel.send({embed})
          }, 2500);
    }
  
  if(command === "stop") {
                var server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
                server.queue.splice(0, server.queue.length);
            }
  }
  
  if(command === "skip") {
                var server = servers[message.guild.id];
            if (server.dispatcher) {
                server.dispatcher.end();
            }
  }
  
  if(command === "settings") {
  var embed = new Discord.RichEmbed()
  .setDescription("These commands are for welcome/leave messages and mod-logs")
  .addField("cn!setModLog", "Sets a mod-log channel. ( Must need a channel called `mod-logs` )\n`cn!setprefix` | Changes the server's prefix")
  return message.channel.send(embed)
}

if(command === "slots") {
  let chance = [":apple:", ":peach:", ":banana:"];
  let chance2 = [":heart:", ":orange:", ":cherries:"];
  let chance3 = [":green_apple:", ":pear:", ":cherries:"];
  let slot = chance[Math.floor(Math.random() * chance.length)];
  let slot2 = chance2[Math.floor(Math.random() * chance2.length)];
  let slot3 = chance3[Math.floor(Math.random() * chance3.length)];
  message.channel.send(`**:slot_machine: | Slot Machine!!\n---------------\n${slot}-${slot2}-${slot3}\n${slot}-${slot2}-${slot3}\n${slot}-${slot2}-${slot3}\n----------------\nDid You Win??**`)
}


if(command === "suggest") {
  message.channel.send("Your suggestion has been sent to the owner. He will look at adding that in the bot soon.")
  console.log(message.author.tag + ": " + message.content);
}
  
    if (command === 'setmon') {
    
            // Check if they have the modRole
                if(!message.member.roles.some(r=>["Administrator", "Moderator","Mod","Admin","Staff","King","Bot Creator"].includes(r.name)) ) { // Run if they dont have role...
                message.channel.send('**You need the role `' + modRole + '` to use this command...**');
                return;
            }
    
            // Check if they defined an amount
            if (!args[0]) {
                message.channel.send(`**You need to define an amount. Usage: cn!setmon <amount> <user>**`);
                return;
            }
    
            // We should also make sure that args[0] is a number
            if (isNaN(args[0])) {
                message.channel.send(`**The amount has to be a number. Usage: cn!setmon <amount> <user>**`);
                return; // Remember to return if you are sending an error message! So the rest of the code doesn't run.
            }
    
            // Check if they defined a user
            let defineduser = '';
            if (!args[1]) { // If they didn't define anyone, set it to their own.
                defineduser = message.author.id;
            } else { // Run this if they did define someone...
                let firstMentioned = message.mentions.users.first();
                defineduser = firstMentioned.id;
            }
    
            // Finally, run this.. REMEMBER IF you are doing the guild-unique method, make sure you add the guild ID to the end,
            economy.updateBalance(defineduser + message.guild.id, parseInt(args[0])).then((i) => { // AND MAKE SURE YOU ALWAYS PARSE THE NUMBER YOU ARE ADDING AS AN INTEGER
                message.channel.send(`**User defined had ${args[0]} added/subtraction from their account.**`)
            });
    
        }

if(command === "ping") {
  if(message.content.length > 5 + process.env.PREFIX.length) return;
  message.channel.send("Ping, " + Math.round(bot.ping) + "ms!")
}
  

if(command === "setname") {
  message.channel.setName(message.content.substr(8));
}

if(command === "botname") {
  if(message.author.id !== config.ownerID) return;
  bot.user.setUsername(message.content.substr(8));
}


if(command === "info") {
  var embed = new Discord.RichEmbed()
  .setAuthor("ComplexBotcn!6735", "https://cdn.discordapp.com/avatars/365143848571371521/0eabb8374af42ca3b4e6f1a27d5d3539.png?size=2048")
  .addField("Bot Name", "ComplexBot", true)
  .addField("Owner", "MysticBcn!9712", true)
  .addField("Server Count", bot.guilds.size, true)
  .addField("Users", bot.users.size, true)
  .addField("Library", "Discord.js", true)
  .addField("Complex Bot's Server", "https://discord.gg/XyU82fe", true)
  .addField("Invite Me", "https://discordapp.com/oauth2/authorize?client_id=365143848571371521&scope=bot&permissions=8", true)
  .addField("Contact", "Please contact `MysticBcn!9712` if you have any questions or use `cn!suggest` if you would anything to be added on bot.")
  return message.channel.send(embed);
}


  
  if(command === "rolecreate") {
    message.guild.createRole().then(role => {
      message.channel.send(`Made role ${role.name}`);
    }).catch(console.error);
  }

if(command === "gn") {
  message.guild.setName(message.content.substr(3))
    .then(guild => console.log('Guild updated to', guild.name))
    .catch(console.error);
}

if(command === "messageme") {
  message.author.send('oh, hi there!').catch(e => console.log(e.stack));
}

if(command === "owner"){
var embed = new Discord.RichEmbed()
	.setDescription(":mailbox: Results :mailbox:")
	.addField("cn!eval", "Already Know")
  .addField("cn!botname", "To change the bot name")
  .addField("cn!shutdown", "For when we ant to shutdown the bot")
	.setColor(0x000000)
	 return  message.channel.send(embed);
}

if(command === "git") {
  var embed = new Discord.RichEmbed()
  .setTitle("Learning How to Code")
  .setDescription("This part of the bot teaches you how to code a bot.")
  .setColor('RANDOM')
  .addField("List of JS Librarys", "`cn!discord.js` | Mainly used\n`cn!eris` | Used on Dyno Bot\n`cn!discord.js-commando` | Have better starting commands")
  return message.channel.send(embed)
}

if(command === "discord.js") {
  var embed = new Discord.RichEmbed()
  .setTitle("Discord.JS")
  .setColor("RANDOM")
  .setDescription("Using `Discord.js` to make a discord bot")
  .addField("Getting Started", "If you do not know anything about coding in JavaScript then I suggest you go to one these websites to learn.\n- https://www.sololearn.com/Course/JavaScript/\n - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide\n - https://www.khanacademy.org/computing/computer-programming")
  .addField("Starting on the coding", "Now this is were the magic happens. You can go to my github ( https://github.com/Chick3nBob/discord.js ) or my youtube channel ( https://www.youtube.com/channel/UCmMcggrSXlQOcXWgNuzB4KQ ) where all the coding will be posted")
  .addField("Basic Starting Code", "```js\nconst Discord = require('discord.js');\nconst client = new Discord.Client();\n\nclient.on('ready', () => {\nconsole.log('I am ready!');\n});\n\nclient.on('message', message => {\nif (message.content === 'ping') {\nmessage.reply('pong');\n}\n});\n\nclient.login('your token');\n```")
  return message.channel.send(embed)
}

if(command === "memes") {
	if(message.content.lenght > 5 + process.env.PREFIX.length) return;
	var embed = new Discord.RichEmbed()
	.setDescription(":mailbox: Results :mailbox:")
	.addField("commands", "`cn!rmeme`| Generates A random Meme")
	.setColor('RANDOM')
	 return  message.channel.send(embed);
}


   if(command === "join") {
     if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply('I have successfully connected to the channel!');
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  } else

   if(command === "hey") {
     if(message.content.length > 3 + process.env.PREFIX.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else

   if(command === "cookie") {
     if(message.content.length > 6 + process.env.PREFIX.length) return;
     message.channel.send('Here is your cookie ' + message.author.username + ' http://www.greatamericancookies.com/app/themes/greatamericancookies/library/images/home/carousel1.png').catch(console.error);
   } else


   if(command === "chicken") {
     if(message.content.length > 7 + process.env.PREFIX.length) return;
     message.channel.send('Here is your chicken ' + message.author.username + ' https://media1.s-nbcnews.com/j/newscms/2017_20/1215661/baked-chicken-today-170519-tease_15b214baba5431d761c7a46cf08e062c.today-inline-large.jpg')
   }
  

   if(command === "hallo") {
     if(message.content.length > 5 + process.env.PREFIX.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else

   if(command === "servers") {
     if(message.content.length > 7 + process.env.PREFIX.length) return;
     message.channel.send(bot.guilds.map(g => '`' + `${g.name} | ${g.memberCount}` + '`')).catch(console.error);
   } else

if(command === "commands") {
    message.channel.send("Here are my commands. Please contact `MysticBcn!9712` if there are any broken commands")
    message.channel.send("```html\ncn!info | For My Info\ncn!mod | Moderate Commands ( Need a Staff Role )\ncn!server | Basic server commands\ncn!fun | This will show you all y fun commands\ncn!memes | Shows you all the memes I have xD\ncn!owner | Only owners have access to these commands\ncn!settings | These commands help you set mod-logs, join/leave messages etc\ncn!git | This shows you all the ways you can make a discord bot for your own server.\ncn!economy | Shows economy commands including leveing system.```")
}

  
        if(command === "economy") {
            var embed = new Discord.RichEmbed()
            .setTitle("Economy Commands")
            .setDescription("So I see you want to apart of the comunnity. Well just look at these commands and see what you like.")
            .setColor('RANDOM')
            .addField("Commands", "`cn!level` | Shows what level you are currently on.\n`cn!points` | Shows how much you have.\n`cn!payday` | Adds $250 to your balance.\n`cn!payfine` | Removes $250 from balance.\n`cn!daily` | Daily rewards\n`cn!top` | Shows the top people out of all servers")
            return message.channel.send(embed)
        }
  

   if (command === "delchann") {
    message.channel.delete().then(chan => console.log('selfDelChann', chan.name));
  }

  if(command === "gitlearn") {
    message.channel.send("So, you want to learn to code? Good on you! Here are some resouces that will be helpful on your journey:\nFirst, learn these:\n\nAbsolute Basics:\n- https://www.codecademy.com/\n\nThis will teach you the fundamentals of coding logic, but little more.\nAlgorithms:\n\n- https://www.khanacademy.org/computing/computer-science/algorithms\n\nThen, pick a language:\nGeneral:\nEncompass several languages\n- https://teamtreehouse.com/\n- https://www.codewars.com/\n- https://www.nostarch.com/catalog/programming - costs money\n\n- http://www.oreilly.com/programming/free/\nJavaScript:\n- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide\n- https://www.khanacademy.org/computing/computer-programming - also does HTML and SQL\n- https://www.freecodecamp.com/ - also does HTML and CSS3\n- https://nodeschool.io/")
  }

  if (command === "myperms") {
    if(message.content.length > 7 + process.env.PREFIX.length) return;
    message.channel.send("Permission List\n```js\n" + JSON.stringify(message.channel.permissionsFor(message.author).serialize(), null, 4) + "```")
  }


if(command === "userinfo") {
  let info = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!info) return message.channel.send("You did not specify a user Mention");
  let member = message.mentions.members.first();
  let mention = message.mentions.users.first();
  let embed = new Discord.RichEmbed()
    .setDescription(`This is the info about **@${mention.username}cn!${mention.discriminator}**`)
    .setColor('RANDOM')
    .setThumbnail(`${member.user.avatarURL}`)
    .addField("**Username : **", `${mention.username}`, true)
    .addField("**User Discriminator :**", `cn!${mention.discriminator}`, true)
    .addField("**User ID :**", `${member.id}`, true)
    .addField("**Playing :**", `${member.user.presence.game === null ? "No Game" : member.user.presence.game.name}`, true)
    .addField("**NickName :**", `${member.nickname}`, true)
    .addField("**Roles :**", `${member.roles.map(r => r.name).join(" -> ")}`)
    .addField("**Joined Guild :**", `${message.guild.joinedAt}`)
    .addField("**Joined Discord :**", `${member.user.createdAt}`)
    .setFooter(`User that triggered command -> ${message.author.username}cn!${mention.discriminator}`)
  message.channel.send(embed);
}
  
  if (command === "play"){
      const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel){
      return message.channel.sendMessage(":x: You must be in a voice channel first!");
    }
    voiceChannel.join()
    .then(connection => {
      let stream = ytdl(args.join(" "), {audioonly: true});
      ytdl.getInfo(args.join(" "), function(err, info) {
      const title = info.title
      console.log(`${message.author.username}, Queued the song '${title}.'`)
      message.channel.sendMessage(`Now playing \`${title}\``)
      })
      const dispatcher = connection.playStream(stream);
      dispatcher.on('end', () => {
         voiceChannel.leave();
       }).catch(e =>{
         console.error(e);
       });
    })
  }
  
  if(command === "playing") {
                var iconurl = bot.user.avatarURL;
            if (nowplaying[message.guild.id]) {
                var video = nowplaying[message.guild.id];
                var embed = new Discord.RichEmbed()
                    .setAuthor("Music", iconurl)
                    .setColor([0, 255, 0])
                    .setDescription("**Now Playing:**\n" +
                    video.title)
                    .setThumbnail(video.thumbnail)
                message.channel.send(embed);
            }
            else {
                var embed = new Discord.RichEmbed()
                    .setAuthor("Music", iconurl)
                    .setColor([0, 255, 0])
                    .setDescription("No music is playing.")
                message.channel.send(embed);
            }
  }
  
  if (command === 'skip') {
    const connections = new Map();

let broadcast;
    if (connections.has(m.guild.id)) {
      const connData = connections.get(m.guild.id);
      if (connData.dispatcher) {
        connData.dispatcher.end();
      }
    }
    }
  
  if(command === "serverinfo") {
    var embed = new Discord.RichEmbed()
    .setDescription(message.guild.name + "'s Info")
    .setColor('RANDOM')
    .setThumbnail(message.guild.iconURL)
    .addField("Server Name", message.guild.name, true)
    .addField("Member Count", message.guild.memberCount, true)
    .addField("Roles", message.guild.roles.map(role => role.name).join(', '), true)
    .addField("Server Owner", message.guild.owner, true)
    .addField("Channels", message.guild.channels.size, true)
    .addField("Bots", message.guild.members.filter(member => member.user.bot).size, true)
    .setFooter(message.author.tag + " has used this command")
    return message.channel.send(embed)
}

  if(command === "fun") {
    if(message.content.length > 3 + process.env.PREFIX.length) return;
    message.channel.send({embed: {
    color: 000000,
    author: {
      name: message.author.user,
      icon_url: message.author.avatarURL
    },
    title: "Fun Commands!",
    description: "This is all the fun commands with what they do. These are/can be used by anyone and rveryone in the server. My fun commands are not much but they can be fun to use. PM the owner **DJ** and he'll  you.",
    fields: [{
        name: ".",
        value: "`cn!cookie` | This gives you a cookie.\n `cn!hi, hey, hello` | The bot will just simply say Hello back.\n `cn!ping` | Gives you your ping.\n `cn!kill` | Use this do kill someone ( Must ping that person )\n `cn!hug` | Use this to hug yours'\n `cn!stab` | STAB SOMEBODY\n `cn!shoot` | SHOOT SOMEBODY\n `cn!kiss` | Give a lovely kiss to the one you love.\n`cn!8ball` | Ask a question and it answers\n`cn!dice` | Role a dice\n`cn!slots` | Get lucky and win so stuff",
            }],
        timestamp: new Date(),
    footer: {
      icon_url: message.author.avatarURL,
      text: message.author.username
    }
  }
});
  }

if(command === "mod") {
  if(message.content.length > 3 + process.env.PREFIX.length) return;
  message.channel.send({embed: {
  color: 000000,
  author: {
    name: message.author.user,
    icon_url: message.author.avatarURL
  },
  title: "MOD Commands!",
  description: "These are all my MOD commands. Now these commands can only be used by a Admin or up. Any others that try to use this command will fail hard. Please do not try and kick the bot with its own commands thats just stupid.\n**Please Note You will need a channel called `mod-logs` to log all**",
  fields: [{
      name: "Commands!",
      value: "`cn!mute` | This command is self explained ( mute a player )\n`cn!warn` | Use this to just warn a member if they are not fulling the rules ( cn!warn <@user> <reason> )\n`cn!kick` | Use this to kick a member\n`cn!ban` | Use this to ban a member\n`cn!purge` | Purge deletes messages fro chat. ( cn!purge <1-99> )\n`cn!roleadd` | Adds a role to a user",
       }
    ],
      timestamp: new Date(),
  footer: {
    icon_url: message.author.avatarURL,
    text: message.author.username
  }
}
});
}

if(command === "util") {
  if(message.content.length > 4 + process.env.PREFIX.length) return;
  message.channel.send({embed: {
  color: 000000,
  author: {
    name: message.author.user,
    icon_url: message.author.avatarURL
  },
  title: "Util Commands!",
  description: "These are all my Util commands. These commands are basic simply as you can say I guess.",
  fields: [{
      name: "Commands!",
      value: "`cn!serverinfo` | Shows your serverinfo\n`cn!userinfo` | Get a users' info\n`cn!info` | This shows the info of who created the bot, what library it is, servers its in etcn!..\n`cn!invite` | Use this to invite me to your server\n`cn!servers` | Shows how many servers I'm in"
    }],
      timestamp: new Date(),
  footer: {
    icon_url: message.author.avatarURL,
    text: message.author.username
  }
}
});
}

  if(command === "chid") {
    message.channel.send(`Oo so you looking for this channel's ID? Well its:\n` + "**" + message.channel.id + "**");
    console.log(message.author.tag + " Has gotten the channel ID for " + message.guild.name + ". Channel: " + message.channel.name);
  }
  
 if(command === "roleadd") {
    const member = message.mentions.members.first();
    const mrole = message.mentions.roles.first();
    if(!message.member.roles.some(r=>["Administrator", "Moderator","Mod","Admin","Staff","King"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");

  
  if(!member) {
    message.reply("You did not mention a member to add role to.")
  }
  
  if(!mrole) {
    message.reply("You did not define any roles")
  }
  
  member.addRole(mrole).then(() => {
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(mrole + " has been successfully given to " + member)
    return message.channel.send(embed)
  })
  }
  

  if(command === "rolerem") {
    const member = message.mentions.members.first();
    const mrole = message.mentions.roles.first();
    if(!message.member.roles.some(r=>["Administrator", "Moderator","Mod","Admin","Staff","King"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");
  
  if(!member) {
    message.reply("You did not mention a member to add role to.")
  }
  
  if(!mrole) {
    message.reply("You did not define any roles")
  }
  
  member.removeRole(mrole).then(() => {
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(mrole + " has been successfully removed from " + member + " by " + message.author.tag + ".")
    return message.channel.send(embed)
  })
  }
});


bot.login(process.env.TOKEN);
