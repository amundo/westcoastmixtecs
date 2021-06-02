export class RadioOption extends HTMLElement {
  static get observedAttributes(){
    return ['value']
  }

  set value(value){
    return this.setAttribute('value', value)
  }

  get value(){
    return this.getAttribute('value')
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute === 'value'){
      this.value = this.getAttribute('value')
    } else {
      this.value = this.textContent.trim()
    }
  }

  connectedCallback(){
  }
}

customElements.define('radio-option', RadioOption)
