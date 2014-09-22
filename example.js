var opgg = require('./client.js');
var options = { 'host': '127.0.0.1' };
var gg = new opgg(options);

gg.Region('kr', function(data){
  console.log(data);
});