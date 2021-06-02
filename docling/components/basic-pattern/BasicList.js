import {BasicView} from './BasicView.js'

export class BasicList extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <header></header>
      <main></main>
      <footer></footer>
    `

    this.items = []

    this.view = BasicView

    this.listen()
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  set data(items){
    this.items = items
    this.render()
  }

  get data(){
    return this.items
  }

  add(item){console.log`add`
    this.items.push(item)
    this.render()
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render(){
    this.querySelector('main').innerHTML = ``
    this.items.forEach(item => {
      let view = new this.view
      
      view.data = item
      view.render()
      console.log(item)

      this.querySelector('main').append(view)
    })
  }

  listen(){
  }
}

customElements.define('basic-list', BasicList)