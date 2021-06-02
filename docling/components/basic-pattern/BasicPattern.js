import {BasicList} from './BasicList.js'
import {BasicEditor} from './BasicEditor.js'

export class BasicPattern extends HTMLElement {
  constructor(){
    super()

    this.innerHTML = `
      <header></header>
      <basic-editor></basic-editor>
      <basic-list></basic-list>
      <footer></footer>
    `

    this.listen()
  }

  set dataType(object){
    this.object = object
    this.querySelector('basic-editor').data = object
  }

  get data(){
    return this.object
  }

  set view(view){
    this.querySelector('basic-list').view = view
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'fields'){
      this.data = newValue.split(/[ ,]+/g).map(x => x.trim())
    }
  }

  connectedCallback(){
    
  }

  render(){

  }

  listen(){
    addEventListener('item-created', itemCreatedEvent => 
      this.querySelector('basic-list').add(itemCreatedEvent.target.data)
    )
  }
}

customElements.define('basic-pattern', BasicPattern)