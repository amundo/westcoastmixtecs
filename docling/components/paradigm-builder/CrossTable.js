class CrossTable extends HTMLElement {
  constructor(){
    super()

    this.innerHTML = `
      <main class=cross-table></main>
    `

    this.grid = this.querySelector('main.cross-table')
    this.grid.style.display = 'grid'

  }

  read(){
    let inputs = Array.from(this.querySelectorAll('input'))
    
    return inputs
      .map(input => ({
        form: input.value,
        features: Object.assign({}, input.dataset)
      }))
      .filter(({form}) => form)
  }

  connectedCallback(){
    this.render()
  }

  static get observedAttributes(){
    return [
      'row-category',
      'row-values', 
      'column-category',
      'column-values'
    ]
  }
  
  parseAttribute(attribute){
    return attribute.split(/[ ,]+/g).map(x => x.trim())
  }
  
  attributeChangedCallback(attribute, oldValue, newValue){
    switch (attribute) {
      case 'row-values':
        this.rowValues = this.parseAttribute(newValue)
        break
      case 'column-values':
        this.columnValues = this.parseAttribute(newValue)
        break
      case 'row-category':
        this.rowCategory = newValue
        break
      case 'column-category':
        this.columnCategory = newValue
        break
      default:
        break
    }
  }

  get data(){
    return this.read()
  }

  renderItem(item){

  }

  render(){
    this.grid.style.gridColumns = this.columnValues?.length || 0 
    this.grid.style.gridRows = this.rowValues?.length || 0 

    this.grid.innerHTML = ``

    if(this.rowValues && this.columnValues){
      let matrix = this.rowValues.map((rowValue, rowIndex) => 
      this.columnValues.map((columnValue,columnIndex) => {
        let div = document.createElement('div')
        div.dataset[this.rowCategory] = rowValue
        div.dataset[this.columnCategory] = columnValue
        div.style.gridRow = rowIndex + 1
        div.style.gridColumn = columnIndex + 1
        div.style.display = 'grid'

        let input = document.createElement('input')
        input.placeholder = `${rowValue}_${columnValue}`
        input.style.gridRow = rowIndex + 1
        input.style.gridColumn = columnIndex + 1

        input.name = `${rowValue}_${columnValue}`
        input.dataset[this.rowCategory] = rowValue
        input.dataset[this.columnCategory] = columnValue

        // div.append(input)
        
        this.grid.append(input)
      })
    )

    }
  }

  listen(){

  }
}

customElements.define('cross-table', CrossTable)
export {CrossTable}