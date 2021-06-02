export class RecordText extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <header>
        
      </header>
      <main>
      </main>
      <footer>
      </footer>
    `
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render(){

  }
  listen(){

  }
}

customElements.define('record-text', RecordText)