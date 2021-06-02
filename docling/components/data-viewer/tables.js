let matrixToCollection = matrix => {
  let keys = matrix.shift()
  return matrix.map(row => 
    Object.fromEntries(row.map((value,i) => [keys[i], value]))
  )
}

let collectionToMatrix = collection => {
  let keys = Object.keys(collection[0])

  return collection.map(item => 
    keys.map(key => item[key])
  )
}

let collectionToTable = collection => {
  let table = document.createElement('table')
  let thead = document.createElement('thead')
  let tbody = document.createElement('tbody')

  let headers = Object.keys(collection[0])

  thead.innerHTML = headers
    .map(header => `<th>${header}</th>`)
    .join('\n')
  
  collection.forEach(item => {
    let tr = document.createElement('tr')

    headers
      .map(header => {
        let td = document.createElement('td')
        td.textContent = item[header]
        tr.append(td)
        return tr
      })
      .forEach(tr => tbody.append(tr))
  })

  table.append(thead)
  table.append(tbody)

  return table
}

let matrixToTable = matrix => collectionToTable(matrixToCollection(matrix))

let tableToCollection = table => {
  let matrix = [...table.rows]
    .map(row => [...row.cells].map(cell => cell.textContent))

  return matrixToCollection(matrix)
}

let tableToMatrix = table => {
  let collection = tableToCollection(table)
  return collectionToMatrix(collection)
}

let transposeMatrix = matrix => {
  return matrix[0]
  .map((column, i) => 
    matrix.map(row => row[i])
  )
}

let columnRowToTable = (table, columnHeader) => {
  let matrix = tableToMatrix(table)
  matrix[0].push(columnHeader)
  matrix.slice(1)
    .forEach(row => row.push(""))
  return 
}

export { 
  collectionToMatrix ,
  collectionToTable ,
  columnRowToTable ,
  matrixToCollection ,
  matrixToTable ,
  tableToCollection ,
  tableToMatrix ,
  transposeMatrix 
}
