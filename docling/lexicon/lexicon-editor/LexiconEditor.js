import {Lexicon} from '../Lexicon.js'
import {WordEditor} from '../../word/word-editor/WordEditor.js'
import {WordList} from '../../word/word-list/WordList.js'
import {MetadataEditor} from '../../metadata/metadata-editor/MetadataEditor.js'

export class LexiconEditor extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <metadata-editor></metadata-editor>
      <word-editor></word-editor>
      <word-list editable></word-list>
    `

    // this.lexicon = new Lexicon()

    this.data = {
      metadata: {},
      words: []
    }

    this.listen()
  }


  static get observedAttributes(){
    return ['src', 'edit-in-place']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'src'){
      this.fetch(newValue)
    }
  }

  connectedCallback(){

  }

  set data({words=[], metadata={}}){ 
    this.words = words
    this.metadata = metadata
    this.querySelector('word-list').data = words
    this.querySelector('metadata-editor').data = metadata
    this.render() 
  }

  get data(){
    return {
      words: this.querySelector('word-list').data,
      metadata: this.querySelector('metadata-editor')
    }
  }

  render(){   
    this.querySelector('word-list').data = this.data.words

    this.clear()
  }

  has(word){
    return this.words.some(known => this.areSame(known, word))
  }

  areSame(a,b){
    return a.form == b.form && a.gloss == b.gloss
  }

  arentSame(a,b){
    return !this.areSame(a,b)
  }

  clear(){
    this.querySelector('word-editor').clear()
  }

  get lexicon(){
    return {
      words: this.querySelector('word-list').data,
      metadata: this.querySelector('metadata-editor').data
    }
  }

  async fetch(url){
    let response = await fetch(url)
    let lexicon = await response.json()
    this.data = lexicon 
  }

  dispatch(name){
    let customEvent = new CustomEvent(name, {
      bubbles: true
    })

    this.dispatchEvent(customEvent)
  }

  addText(text){
    let words = text.sentences.map(sentence => sentence.words).flat()

    let title = `Lexicon from: ${text.metadata.title}`

    // this.metadata = {title, "wordCount": words.length}

    words.forEach(word => this.add(word))
    
    this.render()
  }


  remove(words){
    if(!Array.isArray(words)){ words = [words]}

    this.render()
  }

  add(words){
    if(!Array.isArray(words)){ 
      let word = words
      words = [word]
    }

    words.forEach(word => {
      if(!this.has(word)){
        this.querySelector('word-list').data = [
          ...this.querySelector('word-list').data, 
          word
        ]
        this.dispatch('lexicon-editor-add-word')
      }
    })

    this.render()
  }

  remove(wordToRemove){
    if(this.has(wordToRemove)){
      this.words = this.words.filter(word => this.arentSame(word, wordToRemove))
    }
    this.render()
  }


  listen(){
    this.addEventListener('word-editor-submit', wordEditorCreatedEvent => {
      let word = wordEditorCreatedEvent.target.data
      this.add(word)
    })
  }
}

customElements.define('lexicon-editor', LexiconEditor)