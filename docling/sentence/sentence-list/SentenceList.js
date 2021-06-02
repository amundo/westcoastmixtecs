import {SentenceView} from '../sentence-view/SentenceView.js'
import {SentenceEditor} from '../sentence-editor/SentenceEditor.js'

export class SentenceList extends HTMLElement {
  constructor(){
    super()
    this.edit = false
    this.sentences = [] 
  }

  static get observedAttributes(){
    return ['edit']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'edit'){
      this.edit = true
    }
  }

  get data(){
    return this.sentences
  }

  set data(sentences){  
    this.sentences = sentences 
    this.render() 
  }

  connectedCallback(){

  }

  render(){
    this.innerHTML = ``

    if(!this.edit){
      this.data.forEach(sentence => {
        let sentenceView = new SentenceView()
        sentenceView.data = sentence
        this.append(sentenceView)
      })
    }

    if(this.edit){
      this.data.forEach(sentence => {
        let sentenceEditor = new SentenceEditor()
        sentenceEditor.data = sentence
        this.append(sentenceEditor)
      })
    }

  }
}

customElements.define('sentence-list', SentenceList)
