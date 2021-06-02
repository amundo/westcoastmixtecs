import {DataViewer} from '../../components/data-viewer/DataViewer.js'

export class MetadataView extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <details class=metadata-view-details>
        <summary class=metadata-view-summary>Metadata</summary>
        <data-viewer></data-viewer>
      </details>
    `
  }

  set data(metadata){  
    this.metadata = metadata
    this.render()
  }

  get data(){
    return this.metadata
  }

  connectedCallback(){
  }

  static get observedAttributes(){
    return ['summary', 'src']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == "summary"){
      this.summary = newValue
    }

    if(attribute == "src"){
      this.fetch(newValue)
    }
  }

  async fetch(url){
    let response = await fetch(url)
    let metadata = await response.json()
    this.metadata = metadata
    this.dispatchEvent(new Event('metadata-loaded', { bubbles:true }))
  }

  render(){
    this.querySelector('summary.metadata-view-summary').textContent = this.summary || this.metadata.title || "Metadata…"
    this.querySelector('data-viewer').data = this.metadata
    // this.querySelector('data-viewer').render()
    
  }

  listen(){

  }
}

customElements.define('metadata-view', MetadataView)