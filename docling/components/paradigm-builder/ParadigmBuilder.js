import {CrossTable} from './CrossTable.js'

export class ParadigmBuilder extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <div class=specifications>
        <div class=row-specification>
          <input placeholder="row category" name=row-category><input placeholder="row values" name=row-values>
        </div>
        ×
        <div class=column-specification>
          <input placeholder="column category" name=column-category><input name=column-values  placeholder="column values" >
        </div>
      </div>
      <cross-table></cross-table>
    `
    this.addEventListener('keyup', e => {
      if(e.key == 'Enter' && e.target.matches('.specifications input')){
        this.render()
      }
    })
  }

  get data(){
    return this.querySelector("cross-table").data
  }

  connectedCallback(){
    this.crossTable = this.querySelector('cross-table')
  }

  static get observedAttributes(){
    return []
  }

  camelize(snake){
    return snake.split("-")
      .reduce((camel, item, i) => {
        if(i === 0){ camel = item }
        else{ camel += item[0].toUpperCase() + item.slice(1).toLowerCase() }
        return camel
      })
  }
  render(){
    this.addEventListener('keypress', () => {
      this.crossTable.setAttribute('row-category', 
        this.camelize(this.querySelector('[name=row-category]').value.trim()))
      this.crossTable.setAttribute('row-values',  
        this.camelize(this.querySelector('[name=row-values]').value.trim()))
      this.crossTable.setAttribute('column-category', 
        this.camelize(this.querySelector('[name=column-category]').value.trim()))
      this.crossTable.setAttribute('column-values', 
        this.camelize(this.querySelector('[name=column-values]').value.trim()))
    })

    this.crossTable.render()
  }

  listen(){

  }
}

customElements.define('paradigm-builder', ParadigmBuilder)