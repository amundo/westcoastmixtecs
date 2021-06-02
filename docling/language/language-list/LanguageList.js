export class LanguageList extends HTMLElement {
  constructor(){
    super()
    
  }

  connectedCallback(){

  }

  set data(languages){
    this.languages = languages
  }

  get data(){
    return this.languages
  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render(){

  }

  listen(){

  }
}

customElements.define('language-list', LanguageList)