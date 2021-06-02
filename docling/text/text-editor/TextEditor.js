import {SentenceEditor} from '../../sentence/sentence-editor/SentenceEditor.js'

export class TextEditor extends HTMLElement {
  constructor(){
    super()
    this.listen()
  }

  connectedCallback(){

  }

  set data(text){
    this.text = text
  }

  get data(){
    return this.text
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

customElements.define('text-editor', TextEditor)