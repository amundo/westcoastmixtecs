var lowerCaseKeys = o => {
  var Object.keys(o).forEach(k => {
    o[k.toLowerCase()] = o[k];
    delete o[k];
  })
  return o;
}

var lowerCaseCollection = collection => collection.map(lowerCaseKeys)
