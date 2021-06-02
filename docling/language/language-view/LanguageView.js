import {DataViewer} from '../'
export class LanguageView extends HTMLElement {
  constructor(){
    super()
    this.language = {}
  }

  connectedCallback(){

  }

  set data(language){
    this.language = language
  }

  get data(){
    return this.language
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

customElements.define('language-view', LanguageView)