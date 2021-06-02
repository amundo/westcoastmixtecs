import {WordList} from '../../word/word-list/WordList.js'

export class SentenceView extends HTMLElement {
  constructor(){
    super()

    this.innerHTML = `
      <header class=sentence-view-header>
        <span class=sentence-number></span>
      </header>
      <p class=transcription></p>
      <word-list></word-list>
      <p class=translation></p>
      <footer class=sentence-view-footer></footer>
    `
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  get data(){
    return this.sentence
  }

  set data(sentence){
    this.sentence = sentence
    this.render()
  }

  render(){
    this.querySelector('.transcription').textContent = this.sentence.transcription
    this.querySelector('.translation').textContent = this.sentence.translation

    if(this.sentence.metadata && this.sentence.metadata.number){
      this.querySelector('.sentence-number').textContent = this.sentence.metadata.number
    }
    
    if(this.sentence.words){
      this.querySelector('word-list').data = this.sentence.words
    }
  }
  
  listen(){

  }


  toWikitext(){
    let {transcription,translation,words} = this.sentence

    return `
{{interlinear|top=${transcription}
|${words.map(({form}) => form).join(' ')}
|${words.map(({gloss}) => gloss).join(' ')}
|${translation}}}
    `
  }
}

customElements.define('sentence-view', SentenceView)