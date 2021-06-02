export class BasicView extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <header class=basic-view-header></header>
      <main class=basic-view-main></main>
      <footer class=basic-view-footer></footer>
    `
    this.listen()
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  set data(item){
    this.item = item
  }

  get data(){
    return this.item
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render(){
    this.querySelector('main').innerHTML = `` 
    Object.entries(this.item)
      .forEach(([property,value]) => {
        // let span = document.createElement('span')
        // span.classList.add('property')
        // span.textContent = value
        // this.querySelector("main").append(span,  ' ')
        this.querySelector("main").insertAdjacentHTML('beforeend',
          `<p class="${property}">${value}</p>`
        )
      })
  } 

  listen(){

  }
}

customElements.define('basic-view', BasicView)