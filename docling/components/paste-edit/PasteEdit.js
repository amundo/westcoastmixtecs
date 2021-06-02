import {ColorPalette} from './ColorPalette.js'

export class PasteEdit extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <color-palette></color-palette>
      <div class=lines>
      </div>
    `
    this.listen()
  }

  get data(){
    return this.plaintext
  }

  set data(plaintext){
    this.plaintext = plaintext
    this.render()
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render(){
    this.plaintext
      .split('\n')
      .map(line => `<p class=line>${line}</p>`)
      .forEach(p => this.querySelector('.lines').insertAdjacentHTML('beforeend', p))

  }

  listen(){
    document.addEventListener('paste', pasteEvent => {
      this.data = pasteEvent.clipboardData.getData('text')
    })

    this.addEventListener('change-color', changeColorEvent => {
      this.activeColor = changeColorEvent.target.value
    })

    this.addEventListener('click', clickEvent => {
      if(clickEvent.target.matches('.line')){
        clickEvent.target.style.backgroundColor = this.querySelector('color-palette').value
      }

    })

    
  }
}

customElements.define('paste-edit', PasteEdit)