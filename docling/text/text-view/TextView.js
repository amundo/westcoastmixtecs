import {SentenceList} from '../../sentence/sentence-list/SentenceList.js'
import {MetadataView} from '../../metadata/metadata-view/MetadataView.js'
import {QueryEditor} from '../../query/query-editor/QueryEditor.js'


export class TextView extends HTMLElement {
  constructor(){
    super()
    this.queries = [] 
    this.innerHTML = `
      <header class=text-view-header>
        <metadata-view class=text-view-metadata></metadata-view>

        <details class=text-view-search-details>
          <summary>Search</summary>
          <query-editor data-type="transcription translation"></query-editor>
        </details>

      </header>
      <sentence-list></sentence-list>
    `

    this.listen()
  }

  connectedCallback(){

  }

  // get collator(){
  //   return new Intl.compare({sensitivity: 'base'}).compare
  // }

  // set collator(options){
  // }

  // get compare(){
  //   return new Intl.compare({sensitivity: 'base'}).compare
  // }

  // set compare(a,b){
  // }

  match(sentence, query){
    if(!Object.keys(query).every(property => sentence[property])){
      return false
    }

    return Object.entries(query)
      .every(([property,value]) => {
        return sentence[property].includes(value)
      })
  }

  search(query){
    if(!query && Object.keys(query)){ return }
    this.querySelector('sentence-list').data = this.data.sentences
      .filter(sentence => this.match(sentence, query))
  }

  parseSentencesReference(references){
    return references
      .split(',')
      .map(x => x.trim())
      .reduce((sentenceNumbers, reference) => {
        if(reference.includes('-')){
          let [start, end] = reference
            .split('-')
            .map(digit => parseInt(digit))

          let range = Array.from(Array(end - start + 1).keys())
            .map(i => start + i)

            sentenceNumbers.push(range)
        } else {
          sentenceNumbers.push(parseInt(reference))
        }
    
        return sentenceNumbers
      }, [])
      .flat(2)
      .map(int => (int).toString())
  }

  static get observedAttributes(){
    return ['src', 'sentences']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'src'){
      this.fetch(newValue)
    }

    if(attribute == 'sentences'){
      let isIncludedSentence = sentence => this.parseSentencesReference(newValue)
        .includes(sentenceNumber => parseInt(sentence.metadata.number))

      this.queries.push(isIncludedSentence)
    }
  }

  set data(text){
    this.text = text
    this.render()
  }
  
  get data(){
    return this.text
  }

  set src(url){
    this.setAttribute('src', url)
  }
  
  get src(){
    return this.getAttribute('src')
  }

  async fetch(url){
    let response = await fetch(url)
    let text = await response.json()
    this.data = text
    this.dispatchEvent(new Event('text-loaded', { bubbles:true }))
  }


  render(){
    this.querySelector('sentence-list').data = this.data.sentences

    this.querySelector('metadata-view').data = this.data.metadata
  }

  listen(){
    this.addEventListener('query-created', queryCreatedEvent => {
      let query = queryCreatedEvent.target.data
      this.search(query)
    })
  }
}

customElements.define('text-view', TextView)