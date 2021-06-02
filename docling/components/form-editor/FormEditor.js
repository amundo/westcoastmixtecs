export class FormEditor extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <input name=properties placeholder=properties>
      <form>form here</form>
    `
    this.listen()
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  parse(value){
    let fields = value.split(/[, ]+/g).map(field => field.trim())
    this.data = fields
    this.render()
  }

  render(){
    this.querySelector('form')
      .innerHTML = ``
    this.data.forEach(field => {
      let input = document.createElement('input')
      input.placeholder = field
      input.name = field
      this.querySelector('form').append(input)
    })
  }

  listen(){
    this.addEventListener('keyup', keyupEvent => {
      if(keyupEvent.target.matches('[name=properties]'))
      this.parse(keyupEvent.target.value.trim())
    })
  }
}

customElements.define('form-editor', FormEditor)