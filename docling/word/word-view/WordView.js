
export class WordView extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  get data(){
    return this.word
  }

  set data(word){
    this.word = word
    this.render()
  }

  render(){
    this.innerHTML = `
      <span class=form>${this.word.form}</span>
      <span class=gloss>${this.word.gloss}</span>
    `
  }
  
  listen(){

  }
}

customElements.define('word-view', WordView)