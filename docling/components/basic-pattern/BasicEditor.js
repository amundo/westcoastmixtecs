export class BasicEditor extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
    <header></header>
    <form>
      <fieldset></fieldset>
      <button type=submit>Save</button>
    </form>
    <footer></footer>
    `
    this.listen()
  }

  connectedCallback(){

  }

  read(){
    return Array.from(this.querySelectorAll('input'))
      .reduce((object, input) => {
        object[input.name] = input.value.trim()
        return object
      }, {})
  }

  get data(){
    return this.read()
  }
  
  set data(object){
    this.object = object
    this.render()
  }

  clear(){
    this.querySelectorAll('input')
      .forEach(input => input.value = '')
    
    this.querySelector('input').focus()
  }

  renderField(property, value){
    let input = document.createElement('input')
    input.name = property
    input.placeholder = property
    return input
  }

  identify(value){
    if(typeof value == 'string'){
      return 'string'
    } else if(typeof value == 'number'){
      return 'number'
    } else if (Array.isArray(value)){
      return 'array'
    } else {
      return 'object'
    }
  }

  render(){
    this.querySelector('fieldset').innerHTML =``
    Object.entries(this.object)
      .forEach(([property, value]) => {
        switch (this.identify(value)) {
          case 'string':
            this.querySelector('fieldset')
              .append(this.renderField(property, value))
            break;
            // expand for other types and nested objects/arrays
          default:
            break;
        }
      })

  }

  listen(){
    this.addEventListener('submit', submitEvent => {
      submitEvent.preventDefault()
      let itemCreatedEvent = new CustomEvent('item-created', {bubbles:true})
      this.dispatchEvent(itemCreatedEvent)

      this.clear()
    })
  }
}

customElements.define('basic-editor', BasicEditor)