export class JSONLoader extends HTMLElement {
  static get observedAttributes(){
    return ['src']
  }

  constructor(){
    super()
    this.fileReader = new FileReader()
  
    this.innerHTML = `
    Load .json file: <input type=file accept=".json,.JSON">
    `
    
    this.listen()
  }

  render(){
    // this.querySelector("pre").textContent = JSON.stringify(this.json, null, 2)
  }

  listen(){
    this.fileReader.addEventListener('load', loadEvent => {
      this.json = JSON.parse(loadEvent.target.result)
      this.dispatchEvent(new CustomEvent('json-loaded', {
        bubbles:true
      }))
    })

    this.querySelector('input[type=file]').addEventListener('change', changeEvent => 
      this.fileReader.readAsText(changeEvent.target.files[0])
    )
  }
}

customElements.define('json-loader', JSONLoader)