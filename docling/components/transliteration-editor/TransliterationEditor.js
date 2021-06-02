import {transliterate} from './transliterate.js'

export class TransliterationEditor extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <div class=input>    
        <select name=from></select>  
        <textarea></textarea>
        </div>
        
      <div class=output>    
        <select name=to></select>
        <textarea class=output></textarea>
      </div>
      
      <div class=cheatsheet>cheatsheet</div>
    `
    this.listen()
  }

  static get observedAttributes(){
    return ['language-src', 'from', 'to']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    switch (attribute) {
      case 'language-src':
        this.fetch(newValue) 
        break
      case 'from':
        this.from = newValue 
        break
      case 'to':
        this.to = newValue 
        break
      default:
        break
    }
  }
  
  async fetch(url){
    let response = await fetch(url)
    this.language = await response.json()

    this.renderOrthographySelects()
    this.render()
  }
  
  set from(value){
    this.querySelector('.input select[name=from]').value = value
  }

  set to(value){
    this.querySelector('.output select[name=to]').value = value
  }

  get from(){
    return this.querySelector('.input select[name=from]').value
  }

  get to(){
    return this.querySelector('.output select[name=to]').value
  }

  get cheatsheet(){
    return this.language.orthography
      .map(o => [o[this.from], o[this.to]])
      .filter(([from,to]) => from != to)
      .map(([from,to]) => `
        <span class=correspondence>
          <kbd class=from>${from}</kbd><kbd class=to>${to}</kbd>
        </span>
      `)
      .join(' ')
  }
  
  updateOrthographySelects({from=this.from, to=this.to}){
    this.from = from
    this.to = to
  }

  renderOrthographySelects(){
    let orthographyNames = Object.keys(this.language.orthography[0])

    this.querySelectorAll('select').forEach(select => select.textContent = '')

    orthographyNames
      .map(orthographyName => {
        let option = document.createElement('option')
        option.textContent = orthographyName
        option.value = orthographyName

        return option
      })
      .forEach(option => {
        this.querySelector('.input  select[name=from]')
          .append(option)

        this.querySelector('.output select[name=to]')
          .append(option.cloneNode(true))
      })
  }

  render(){console.log({from:this.from,to:this.to})
    this.querySelector(`.input select option[value="${this.from}"]`).selected = true
    this.querySelector(`.output select option[value="${this.to}"]`).selected = true
    
    this.querySelector('.cheatsheet').innerHTML = this.cheatsheet
  }

  transliterate(){
    let [input, output] = this.querySelectorAll('textarea')
    output.value = transliterate(input.value,  this.language.orthography, this.from, this.to)
  }

  listen(){
    this.addEventListener('keyup', keyupEvent => this.transliterate())
    this.addEventListener('change', changeEvent => { 
      if(changeEvent.target.matches('select')){
        this.render()
        this.transliterate()
      }
    })
  }
}

customElements.define('transliteration-editor', TransliterationEditor)

