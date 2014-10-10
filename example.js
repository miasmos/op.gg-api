var opgg = require('./client.js');
var options = { 'host': '127.0.0.1' };
var gg = new opgg(options);

gg.Summoner('kr', 'SKT T1 Faker', function(data){
  console.log(data);
});