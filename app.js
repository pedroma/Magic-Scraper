Array.prototype.has = function(id){
  for (var i = 0; i < this.length; i++){
    if (this[i] === id) return true;
  }
  return false;
}


var fs = require('fs');
var Card = require('./card.js').Card;
var mongo = require('mongoose'),
    Schema = mongo.Schema;

var CardSchema = new Schema({
  id : Number
, setname : String
, front : {}
, back : {}
});

mongo.connect('mongodb://localhost/magic');
mongo.model('Card', CardSchema);

var Cards = mongo.model('Card');

var files = fs.readdirSync('./ids');
var cards = 0, current = 0;
var sofar = 0;

//var q = Cards.find({}, ['id']);
var q = Cards.find();
q.exec(function(er, records){
  for (var x = 0; x < records.length; x++){
    records[x] = parseInt(records[x].id);
  }

  files.forEach(function(file){
    var lines = fs.readFileSync('./ids/' + file).toString().split('\n');
    lines.forEach(function(line){
      var card_id = parseInt(line);
      // query db
      if (card_id && !records.has(card_id)){
        var card = new Card(line);
        var f = file.replace('.txt', '');
        card.get(function(_card){
          // New db record

          var card_db = new Cards();
          if (_card.front.hasOwnProperty("partA")){
            // this is a flip or split card
          } else if (_card.front.hasOwnProperty("back")) {
            // this is a double card
          } else {
            // normal card
          }
          card_db.id = _card.id;
          card_db.front = _card.front;
          card_db.back = _card.back;
          card_db.set = f;

          // if NOT already in db
          card_db.save(function(err){
            if (!err) { 
              ++current; ++sofar;
              var percent = (current / cards) * 100;
              percent = percent.toFixed(2);
              if (_card.front.name) 
                console.log('(' + sofar + ')\t' + _card.front.name + 
                            ' saved\t\t\t' + percent);
            }
          });
        });
      } else current++;
      cards++;
    });
  });

});
