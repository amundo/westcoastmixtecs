import {RadioOption} from './RadioOption.js'

export class RadioList extends HTMLElement {
  static get observedAttributes(){
    return ['options']
  }

  get help(){
    return `docling.components.RadioList
    
A simple wrapper for a list of radio inputs.
    
Example:

  <radio-list name=color>
      <radio-option>Red</radio-option>
      <radio-option>Green</radio-option>
      <radio-option>Blue</radio-option>
  </radio-list>
    
    `
  }

  get radios(){
    return Array.from(this.querySelectorAll('input[type=radio]'))
  }


  addOption(option){
    let radioOption = new RadioOption()
    radioOption.textContent = option
    this.append(radioOption)
  }

  connectedCallback(){ 
      Array.from(this.querySelectorAll('radio-option')).forEach((radioOption,i) => {
        console.log(radioOption.value)
        let radioInput = document.createElement('input')
        radioInput.type = 'radio'
        radioInput.value = radioOption.value
        radioInput.name = this.getAttribute("name")

        if(i === 0){ radioInput.checked = true }

        let label = document.createElement('label') 
        label.textContent = radioOption.textContent
        label.insertAdjacentElement('afterbegin', radioInput)

        radioOption.replaceWith(label)
      })
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'options'){
      let options = newValue.split(/[, ]+/g).map(x => x.trim())
      options.forEach(option => {
        let radioOption = new RadioOption()
        radioOption.value = option
        this.append(radioOption)
      })
    }
  }

  get value(){
    return this.radios.find(radio => radio.checked).value
  }

  set value(value){
    return this.radios
      .find(radio => radio.value == value).checked = true
  }

}

customElements.define('radio-list', RadioList)


