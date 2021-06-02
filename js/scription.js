
var Scription = function() {};


Scription.prototype._parseField = function(field){
  return field;
}

Scription.prototype._getSchema = function(input){
  var first = Scription.prototype.parse(input)[0];
  var fields = Object.keys(first);
  fields.sort();
  return fields;
}

Scription.prototype._label = function(fields, values){ 
  var labeled = {};

  function isDotted(field) { return field.indexOf('.') > 0 };
  function isEllipsed(field) { 
    var ellipseIndex = field.trim().indexOf('...') || field.trim().indexOf('â€¦');
  };

  // handle dotted fields
  fields.forEach(function(field, i){
    var value = values[i];

    if(isDotted(field)){ 
      var outer = field.split('.')[0],
          inner = field.split('.')[1];
      if( !(outer in labeled) ){ 
        labeled[outer] = {} ;
        labeled[outer][inner] = value;
      } else { 
        labeled[outer][inner] = value};
    } else { 
      labeled[field] = value;
    }
  })
  return labeled ;
}

Scription.prototype._parseIntoStanzas = function(input){
  var stanzas = [];
  return input
    .trim()
    .split(/\n[\n]+/)
    .map(function(stanza){
      return stanza.split(/\n/);
    });
}

Scription.prototype.parse = function(input){
  var data = {};
  var input = input.trim();
  var stanzas = Scription.prototype._parseIntoStanzas(input);

  var schema = stanzas[0] 
    .map(Scription.prototype._parseField);

  stanzas = stanzas.slice(1, stanzas.length);

  data = stanzas.map(function(stanza){
    return Scription.prototype._label(schema, stanza)
  })

  return data;

}

//module.exports = Scription;



