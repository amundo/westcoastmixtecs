

let cartesianProduct = array => array.reduce((a,b) => 
  a.map(x => {
    return b.map(y => {
      return x.concat([y])
    })
  })
  .reduce((a,b) => a.concat(b), [])
, [[]])
