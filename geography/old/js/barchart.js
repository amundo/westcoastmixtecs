
var 
  svg = d3.select('svg');

var render = data => { console.log(data) }


fetch('annotated_towns.json')
 .then(response => response.json())
 .then(render)
 .catch(e => console.log(e))



