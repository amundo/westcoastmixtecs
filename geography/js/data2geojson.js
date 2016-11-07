var toPoint = data => { 
  return {
    type: "Point", 
    coordinates: [ data.latitude, data.longitude ]
  } 
}

var toFeature = data => { 
  return { 
    geometry: toPoint(data), 
    type: "Feature", 
    properties: data 
  }  
}

var toFeatureCollection = data => { 
  return { 
    type: "FeatureCollection", 
    properties: {}, 
    features: data.map(toFeature) 
  } 
}

