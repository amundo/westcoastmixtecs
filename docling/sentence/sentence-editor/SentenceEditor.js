import {WordList} from '../../word/word-list/WordList.js'

export class SentenceEditor extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <form>
        <textarea placeholder=transcription name=transcription></textarea>
        <textarea placeholder=translation name=translation></textarea>
        <word-list edit></word-list>
        <button type=submit>Save</button>
      </form>
    `
    this.sentence = {
      "transcription": "",
      "translation": "",
      "words": []
    }
    
    this.listen()
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return ['transcription', 'translation']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'transcription'){
      this.querySelector('[name=transcription]').value = newValue
    }
    if(attribute == 'translation'){
      this.querySelector('[name=translation]').value = newValue
    }
  }

  set data(sentence){
    this.sentence = sentence
    this.render()
  }

  get data(){
    let sentence = this.read()
    return sentence
  }

  read(){
    let textareas = Array.from(this.querySelectorAll('textarea[name]'))
    let sentence = textareas.reduce((sentence, textarea) => {
      sentence[textarea.name] = textarea.value
      return sentence
    }, {})

    let wordEditors = Array.from(this.querySelectorAll('word-editor')) // !WTF should come from word-list

    let words = wordEditors.map(wordEditor => wordEditor.data)

    sentence.words = words

    return sentence
  }

  tokenize(transcription){
    let words = transcription
      .toLowerCase()
      .split(/\P{Letter}/gu)
      .filter(Boolean)
      .map(form => ({form, gloss: ""}))

    this.sentence.words = words

  }
  
  get words(){
    return this.querySelector('word-list').data
  }
  
  set words(words){
    this.querySelector('word-list').data =  words
  }

  render(){
    this.querySelector('word-list').words = this.sentence.words
  }

  submit(){
    this.data = this.read()
    this.dispatchEvent(new CustomEvent('sentence-editor-created', {bubbles:true}))
  }

  listen(){
    this.addEventListener('submit', submitEvent => {
      submitEvent.preventDefault()
      let sentenceEditorSubmitEvent = new CustomEvent(
        'sentence-editor-submit', 
        { bubbles: true}
      )
      this.dispatchEvent(sentenceEditorSubmitEvent)
    })

    this.addEventListener('paste', pasteEvent => {
      if(pasteEvent.target.matches('[name=transcription]')){
        let transcription = this.querySelector('[name="transcription"]').value.trim()
        let words = this.tokenize(transcription) // ! WTF
        this.data = {transcription, words, translation: ""} // !WTF
        this.sentence.words = words // ! WTF
      }
    })

    this.addEventListener('input', inputEvent => {
      if(inputEvent.target.matches('[name=transcription]')){
        this.data.transcription = inputEvent.target.value
        this.render() // ! WTF
      }
    })

    this.addEventListener('keyup', keyupEvent => {
      if(keyupEvent.target.matches('[name=transcription]')){

      }
    })

    this.addEventListener('word-editor-submit', wordEditorSubmitEvent => {
      // this.data = this.read()
    })
  }
}

customElements.define('sentence-editor', SentenceEditor)