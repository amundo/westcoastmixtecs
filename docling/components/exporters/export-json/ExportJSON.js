export class ExportJSON extends HTMLElement {
  static get observedAttributes(){
    return ['json-file-name', 'from-selector']
  }

  constructor(){
    super()
    this.innerHTML = `
      <button class=export-json-button>export</button>
    `
    this.listen()
  }

  connectedCallback(){
    if(!this.hasAttribute('json-file-name')){
      this.insertAdjacentHTML("afterbegin", `<input name=json-file-name placeholder="export as…">`)
      this.jsonFileName = 'exported.json'
    }
  }

  set text(text){
    this.querySelector("button").textContent = text
  }

  exportJSON(){
    let a = document.createElement('a')
    let data = this.sourceElement.data
    console.log(data)
    let blob = new Blob([JSON.stringify(data, null,2)])
    a.href = URL.createObjectURL(blob)
    a.download = this.jsonFileName
    this.append(a)
    a.click()
   }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'json-file-name'){
      this.jsonFileName = newValue
    }
    if(attribute == 'from-selector'){
      this.sourceElement = document.querySelector(newValue)
    }
  }

  disconnectedCallback(){

  }

  listen(){
    this.addEventListener('click', clickEvent => {
      if(clickEvent.target.matches('button.export-json-button')){
        this.exportJSON()
      }
    })
  }
}

customElements.define('export-json', ExportJSON)