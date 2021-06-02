import {TextView} from '../../text/text-view/TextView.js'

export class CorpusView extends HTMLElement {
  constructor(){
    super()
    this.texts = []
    this.innerHTML = `
      <header class=corpus-header>
      </header>
      <text-view></text-view>
    `
  }

  connectedCallback(){

  }

  set data({texts}){
    this.texts = texts
    this.render()
  }

  get data(){
    return {
      metadata: {},
      texts: this.texts
    }
  }

  async fetchTexts(urls){
    let texts = await Promise.all(urls.map(async url => {
      let response = await fetch(url)
      let text = await response.json()
      return text
    }))

    this.data = {texts}

  }

  static get observedAttributes(){
    return ['src']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'src'){

    }
  }

  get sentences(){
    if(!this.cachedSentences){
      this.cachedSentences = this.texts.map(text => 
        text.sentences.map(sentence => {
          if(!sentence.metadata){ 
            sentence.metadata = {
              source: text.metadata.title
            }
          }
          return sentence
        })
        .flat(2)
      )
      return this.cachedSentences
    }
  }

  get words(){
    if(!this.)
  }

  wordFrequency(){
    Object.entries(this.text.sentences.reduce((words,s) => {words.push(...s.words); return words } , [])
      .map(w => w.form)
      .reduce(frequencyReducer))
      .map(([word, frequency]) => [word.toLowerCase(), frequency])
      .sort(([a,af],[b,bf]) => 
        bf - af 
    )
  }

  render(){
    // this.querySelector('text-list').data = this.data.texts
  }

  listen(){
    addEventListener('click', clickEvent => {
      if(clickEvent.target.matches('a.text-link')){

      }
    })
  }
}

customElements.define('corpus-view', CorpusView)  