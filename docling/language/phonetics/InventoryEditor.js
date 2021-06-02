import {ConsonantChart} from './ConsonantChart.js'
import {VowelChart} from './VowelChart.js'

export class InventoryEditor extends HTMLElement {
  static get observedAttributes(){
    return []
  }

  constructor(){
    super()
    this.inventory = [] 
    this.innerHTML = `
      <consonant-chart src="/~pat/book/data/phonetics/ipa/ipa.json"></consonant-chart>
      <!-- <consonant-chart src=/~pat/book/data/phonetics/ipa/ipa-consonants.json></consonant-chart> -->
      <vowel-chart src=/~pat/book/data/phonetics/ipa/ipa-vowels.json></vowel-chart>
    `
    this.listen()
  }

  connectedCallback(){

  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  disconnectedCallback(){

  }

  render(){

  }

  read(){
    this.querySelectorAll('.selected').forEach(span => {
      this.inventory.push({
        place: span.dataset.place,
        manner: span.dataset.manner,
        voicing: span.dataset.voicing
      })
    })
  }

  listen(){
    this.addEventListener('click', clickEvent => {
      if(['.ipa-consonant', '.ipa-vowel'].some(selector => {
        console.log(selector)
        return clickEvent.target.matches(selector)
      })){
        let span = clickEvent.target
        span.classList.toggle('selected')
        this.read()
      }
    })
  }
}

customElements.define('inventory-editor', InventoryEditor)