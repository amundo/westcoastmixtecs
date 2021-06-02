import {DataViewer} from '../data-viewer/DataViewer.js'

export class TranslatePrompts extends HTMLElement {
  static get observedAttributes(){
    return ['prompts', 'translations']
  }

  constructor(){
    super()
    this.innerHTML = `
      <style>
      translate-prompts {
        display: flex;
        gap: 2em;
        align-items: center;
      }
      </style>
      <table class=prompt-table>
        <thead>
          <tr>
            <th>Prompt</th>
            <th>Translation</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <data-viewer caption="Data"></data-viewer>
    `

    this.listen()
  }

  connectedCallback(){
    this.render()
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'prompts'){
      this.prompts = newValue.split(/[, ]+/g)
        .map(prompt => prompt.trim())
    }
    if(attribute == 'translations'){
      this.translations = newValue.split(/[, ]+/g)
        .map(translation => translation.trim())
    }
  }

  read(){
    let words = []
    this.querySelectorAll('.prompt-table tbody tr').forEach(tr => {
      words.push({
        gloss: tr.querySelector('.gloss').textContent,
        form: tr.querySelector('.form').value
      })
    })
    return words
  }

  render(){ 
    this.querySelectorAll('tbody tr').forEach(tr => tr.remove())
    this.prompts.forEach(prompt => {
      let tr = document.createElement('tr')
      tr.innerHTML = `
        <td class=gloss>${prompt}</td>
        <td><input class=form placeholder="translate"></td>
      `
      this.querySelector('tbody').append(tr)
    })

    if(this.translations){ 
      let inputs = Array.from(this.querySelectorAll('input'))
      this.translations.forEach((translation, i) => {
        inputs[i].value = translation
      })
      this.visualize()
    }
  }

  get data(){
    return this.querySelector("data-viewer").data
  }

  visualize(){
    this.querySelector("data-viewer").data = this.read()
  }

  listen(){
    this.addEventListener('keyup', keyupEvent => {
      if(keyupEvent.key == 'Enter'){
        this.visualize()
      }
    })
  }
}

customElements.define('translate-prompts', TranslatePrompts)