export class  MetadataEditor extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `…metadata editor…`
    this.listen()
  }

  connectedCallback(){

  }

  set data(metadata){
    this.metadata = metadata
  }

  get data(){
    return this.metadata
  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  read(){

  }

  render(){

  }

  listen(){

  }
}

customElements.define('metadata-editor',  MetadataEditor)