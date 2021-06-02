import {MetadataView} from '../../metadata/metadata-view/MetadataView.js'
import {WordList} from '../../word/word-list/WordList.js'
import {QueryEditor} from '../../query/query-editor/QueryEditor.js'
import {SortEditor} from '../../sort/sort-editor/SortEditor.js'

export class LexiconView extends HTMLElement {
  constructor(){
    super()

    this.innerHTML = `
      <header class=lexicon-view-header>
        <metadata-view></metadata-view>
        
        <details class=lexicon-view-search-details>
          <summary>Search</summary>
          <query-editor data-type="form gloss"></query-editor>
        </details>

        <sort-editor sortable-keys="form gloss"></sort-editor>
       </header>

      <word-list>
      </word-list>
    `

    this.metadata = {}
    this.words = []

    this.listen()
  }

  connectedCallback(){
    if(!this.hasAttribute("sort-key")){
      this.setAttribute('sort-key', "form")
    }
  }

  static get observedAttributes(){
    return ['src', 'sort-key', 'layout']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'src'){
      this.fetch(newValue)
    }

    if(attribute == 'sort-key'){
      this.sortKey = newValue
    }
  }

  async fetch(url){
    let response = await fetch(url)
    let lexicon = await response.json()
    this.data = lexicon 

    this.dispatchEvent(new Event('lexicon-fetched', { bubbles:true }))
  }
  
  set data(lexicon){
    this.metadata = lexicon.metadata
    this.words = lexicon.words
    this.sort()
    this.render()
  }

  get data(){
    return {
      metadata: this.metadata,
      words: this.words
    }
  }

  match(word, query){
    if(!Object.keys(query).every(property => word[property])){
      return false
    }
    
    let entries = Object.entries(query)
      .filter(([key,value]) => value)
      
    return entries
      .every(([property,value]) => {
        if(value.startsWith('*') && value.endsWith('*')){
          return word[property].includes(value.slice(1,-1))
        }
        if(value.startsWith('*')){
          return word[property].endsWith(value.slice(1))
        }
        if(value.endsWith('*')){
          return word[property].startsWith(value.slice(0,-1))
        }
        return word[property] == value
      })
  }

  search(query){
    if(!query && Object.keys(query)){ return }
    let words = this.data.words
      .filter(word => this.match(word, query))
    this.querySelector('word-list').data = words
  }

  collate(){
    let settings = this.querySelector('sort-editor').data 
    let collator = new Intl.Collator({})
    
    let compare = (a,b) => collator.compare(a[settings.sortKey], b[settings.sortKey])

    return compare
  }
  
  sort(){
    let compare = this.collate()

    this.words.sort(compare)
    

    this.render()
  }

  has({form,gloss}){
    let match = this.words.find(word => word.form == form && word.gloss == gloss)
    if(match){
      return true
    } else {
      return false
    }
  }

  get src(){
    return this.getAttribute('src')
  }

  set src(src){
    this.setAttribute('src', src)
    this.fetch(src)
  }

  hasnt({form,gloss}){
    return !this.has({form,gloss})
  }

  renderMetadata(){
    this.querySelector('metadata-view').data = this.metadata
  }

  renderWords(){
    this.querySelector('word-list').data = this.words
  }

  render(){ 
    this.renderMetadata()
    this.renderWords()
    this.querySelector('sort-editor').setAttribute('sort-keys', this.sortKeys)
  }

  listen(){
    this.addEventListener('query-created', queryCreatedEvent => {
      let query = queryCreatedEvent.target.data
      this.search(query)
    })

    this.addEventListener('sort-edited', sortEditedEvent => {
      this.sort()
    })
  }
}

customElements.define('lexicon-view', LexiconView)