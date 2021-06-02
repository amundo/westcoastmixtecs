class QueryEditor extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = `
    <form class=query-editor-form>
      <fieldset class=query-editor-terms></fieldset>
      </form>
      `
      // <fieldset class=query-editor-options>Ignore: </fieldset> 
    this.listen()
  }

  get data(){
    return this.query
  }

  render(){
    let form = this.querySelector('form')
    let termsFieldset = this.querySelector('fieldset.query-editor-terms')

    this.dataType.forEach(field => {
      let input = document.createElement('input')
      input.name = field
      input.placeholder = field

      termsFieldset.append(input)
    })

    let button = document.createElement('button')
    button.textContent = 'Search…'
    button.type = 'submit'

    form.append(button)

    this.append(form)
  }

  readTextInputs(){
    let inputs = Array.from(this.querySelectorAll('input'))
      .filter(input => input.value.trim())
  }

  readCheckboxInputs(){
    let inputs = Array.from(this.querySelectorAll('input[type=checkbox]'))
      .filter(input => {
        let boolean = input.matches(':checked')
      })
  }

  readRadioInputs(){
    let inputs = Array.from(this.querySelectorAll('input'))
      .filter(input => input.value.trim())
  }

  read(){
    let inputs = Array.from(this.querySelectorAll('input'))
    let entries = inputs.map(input => [input.name, input.value])

    this.query = Object.fromEntries(entries)     
  }

  static get observedAttributes(){
    return ['data-type']
  }

  connectedCallback() {
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    if(attribute == 'data-type'){
      this.dataType = newValue.trim().split(/[, ]+/g).map(field => field.trim())
      this.render()
    }
  }

  listen(){
    this.addEventListener('click', clickEvent => {
    })

    this.querySelector('form')
      .addEventListener('submit', submitEvent => {
        submitEvent.preventDefault()
        this.read()

        let queryCreatedEvent = new CustomEvent(
          "query-created", 
          {bubbles: true}
        )
        this.dispatchEvent(queryCreatedEvent)

      })
  }

}

customElements.define('query-editor', QueryEditor)

export {QueryEditor}