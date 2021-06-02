
export class UnicodePropertyTester extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `<input>
    <ol></ol>`
    this.load().then(_ => this.render())
  }

  async load(){
    let relativeURL =  new URL('unicode-character-properties.json', import.meta.url).href
    let response = await fetch(relativeURL)
    this.properties  = await response.json()
    console.table(this.properties)
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  renderProperty(property){
    let li = document.createElement('li')
    li.classList.add(property)
    console.log(typeof property)
    li.innerHTML = `
      <input type=checkbox>
      <span class="${property}">${property}</span>
    `
    return li
  }

  check(){
    this.querySelectorAll('ol li').forEach(li => { 
      let checkbox = li.querySelector('input[type=checkbox]')
      // let pattern = 

    })
  }

  render(){
    this.querySelector("ol").innerHTML = ``

    this.properties.forEach(property => {
      this.querySelector('ol').append(this.renderProperty(property.property))
    })
  }

  listen(){

  }
}

customElements.define('unicode-property-tester', UnicodePropertyTester)