export class DoclingNav extends HTMLElement {
  constructor(){
    super()
    this.listen()
    this.fetch()
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  async fetch(){
    let url = new URL('./docling-index.json', import.meta.url).href
    let response = await fetch(url)
    let json = await response.json()
    this.tree = json
    this.render()
  }

  filter(tree){
    return tree.reduce((urls, tree) => {
      if(){
        
      }
    })
  }

  render(){
    this.innerHTML = `<pre>${JSON.stringify(this.tree,null,2)}</pre>`
  }

  listen(){

  }
}

customElements.define('docling-nav', DoclingNav)