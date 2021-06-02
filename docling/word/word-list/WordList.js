import {WordView} from '../word-view/WordView.js'
import {WordEditor} from '../word-editor/WordEditor.js'

export class WordList extends HTMLElement {
  constructor(){
    super()
    this.edit = false
    this.words = [] 
  }

  static get observedAttributes(){
    return ['editable']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'editable'){
      this.editable = true
    }
  }

  set data(words){ 
    this.words = words 
    this.render() 
  }

  get data(){
    if(this.hasAttribute('editable')){
      return Array.from(this.querySelectorAll('word-editor'))
        .map(wordEditor => wordEditor.read())
    } else {
      return this.words
    }
  }

  connectedCallback(){

  }

  render(){
    this.innerHTML = ``
    if(!this.editable){
      this.data.forEach(word => {
        let wordView = new WordView()
        wordView.data = word
        this.append(wordView)
      })
    }

    if(this.editable){
      this.data.forEach(word => {
        let wordEditor = new WordEditor()
        wordEditor.data = word

        this.append(wordEditor)
      })
    }

  }
}

customElements.define('word-list', WordList)