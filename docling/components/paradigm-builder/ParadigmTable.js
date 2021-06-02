let pali = {
  "language": {
    "name": "Pali"
  },  
  "grammar": {
    "metadata": {},
    "categories": [
      {
        "name": "gender",
        "values": [
          "masculine",
          "neuter"
        ]
      },
      {
        "name": "number",
        "values": [
          "singular",
          "plural"
        ]
      },
      {
        "name": "case",
        "values": [
          "nominative",
          "vocative",
          "accusative",
          "instrumental",
          "ablative",
          "dative",
          "genitive",
          "locative"
        ]
      }
    ],
    "lexicon": {
      "metadata": {},
      "words": [
        {
          "form": "loka",
          "gloss": "world"
        },
        {
          "form": "yāna",
          "gloss": "carriage"
        }
      ]
    }
  }
}

class Paradigm {
  constructor({categories}){
    this.categories = categories
  }

  get values(){
    return this.categories.map(category => category.values)
  }

  get matrix(){
    let generate = (values=this.values, matrix=[]) => {
      if(values.length === 0){
        return matrix
      } else {
        return values[0].map(value => generate(values.slice(1), matrix.concat([value])))
      }
    }
    return generate()
  }
}

export class ParadigmTable extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
    `    
  }

  set categories(categories){
    this.matrix = this.generate(categories)
  }

  set data(data){
    
  }

  get data(){

  }

  generate(categories){
    let values = categories.map(category => category.values)

    let build = (values, matrix=[]) => {
      if(values.length === 0){
        return matrix
      } else {
        return values[0].map(value => build(values.slice(1), matrix.concat([value])))
      }
    }

    return build(values)

  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render3D(){console.log(`render3d…`)
    let table = document.createElement('table')

    this.matrix.forEach(row => {
      let tr = document.createElement("tr")
      row.forEach(cell => {
        cell.forEach(item => {
          let td = document.createElement('td')
          tr.append(td)
          let span = document.createElement('span')
          span.textContent = item
          td.append(span)
        })
      })
      table.append(tr)
    })

    return table
  }

  render2D(){
    let table = document.createElement('table')
    
    this.matrix.forEach(row => {
      let tr = document.createElement("tr")
      row.forEach(cell => { console.log(cell)
        let td = document.createElement('td')
        let spans = cell.map(item => `<span>${item}</span>`).join(", ")
        td.innerHTML = spans
        tr.append(td)
      })
      table.append(tr)
    })

    return table

  }


  render1D(){
    let table = document.createElement('table')
    
    this.matrix.forEach(row => {
      let tr = document.createElement("tr")
      let td = document.createElement('td')
      td.textContent = cell
      tr.append(td)

      table.append(tr)
    })

    return table
  }

  render(){
    this.innerHTML = ``

    let depth = (matrix, level=0) => {
      if(!Array.isArray(matrix) || matrix.length === 0){
        return level
      }
    
      level++
    
      return depth(matrix[0],level)
      
    }
    console.log(this.matrix)
    switch (depth(this.matrix)) {
      case 0:
        this.append(this.render1D())
        break;
      case 1:
        this.append(this.render2D())
        break;
      case 2:
        this.append(this.render3D())
        break;
      default:
        break;
    }
  }

  listen(){

  }
}

customElements.define('paradigm-table', ParadigmTable)

// export class ParadigmTable extends HTMLElement {
//   constructor(){
//     super()

//     this.innerHTML = ``

//     this.listen()
//     this.render()
//   }

//   attributeChangedCallback(attribute, oldValue, newValue){

//   }

//   get matrix(){
//     let generate = (values=this.values, matrix=[]) => {
//       if(values.length === 0){
//         return matrix
//       } else {
//         return values[0].map(value => generate(values.slice(1), matrix.concat([value])))
//       }
//     }
//     return generate()
//   }

//   set data(data){
//     this.categories = data
//     this.render()
//   }

//   get data(){
//     return this.categories
//   }

//   render3D(){
//     let table = document.createElement('table')

//     this.data.forEach(row => {
//       let tr = document.createElement("tr")
//       row.forEach(cell => {
//         let td = document.createElement('td')
//         tr.append(td)
//         cell.forEach(item => {
//           let span = document.createElement('span')
//           span.textContent = item
//           td.append(span)
//         })
//       })
//     })

//     return table
//   }

//   render2D(){
//     let table = document.createElement('table')
    
//     this.data.forEach(row => {
//       let tr = document.createElement("tr")
//       row.forEach(cell => {
//         let td = document.createElement('td')
//         td.textContent = cell
//         tr.append(td)
//       })
//     })

//     return table

//   }


//   render1D(){
//     let table = document.createElement('table')
    
//     this.data.forEach(row => {
//       let tr = document.createElement("tr")
//         let td = document.createElement('td')
//         td.textContent = cell
//         tr.append(td)
//      })

//     return table
//   }

//   render(){
//     switch (this.data.length) {
//       case 1:
//         this.render1D()
//         break;
//       case 2:
//         this.render2D()
//         break;
//       case 3:
//         this.render3D()
//         break;
//       default:
//         break;
//     }
//   }

//   listen(){

//   }
// }

// customElements.define('paradigm-table', ParadigmTable)
 

// let p = new Paradigm({
//   categories: pali.grammar.categories
// })

// console.log(JSON.stringify(p.matrix,null,2))


let build = (categories, matrix) =>{
  if(!matrix){
    matrix = []
  } 
  if(categories.length === 0){
    return matrix
  } else {
    return categories[0].map(value => build(categories.slice(1), matrix.concat([value])))
  }
}

let build2 = (matrix=[], categories) => 
  categories.reduce((matrix, categories, i) => {
    if(i === 0){
      return matrix
    } else {
      return categories[0]
        .map()
    }
  }, matrix)

