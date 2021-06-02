export class PDFLoader extends HTMLElement {
  static get observedAttributes(){
    return ['src']
  }

  constructor(){
    super()
    this.reset()
    this.listen()
  }

  reset(){
    this.innerHTML = `
      <style>
      pdf-loader {
        display: grid;
        grid-template:
          "header" auto
          "pdf" 1fr
       /  1fr;
      }

      main {
        display: grid;
      }
        
      </style>
      <input type=file class=load-pdf-input>
      <object></object>
    `
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute=='src'){
      this.querySelector('object').setAttribute('data', newValue)
    }
  }

  connectedCallback(){

  }

  load(file){
    let type = file.type
    let fileName = file.name
    let fileURL = URL.createObjectURL(file)
    this.querySelector('object').setAttribute('data', fileURL)
  }

  listen(){
    this.addEventListener('change', e => this.load(e.target.files[0]))
  }

}


customElements.define('pdf-loader', PDFLoader)