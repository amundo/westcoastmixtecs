import {parseEAF} from './parseEAF.js'

export class ELANLoader extends HTMLElement {
  static get observedAttributes(){
    return ['src']
  }

  constructor(){
    super()

    this.fileReader = new FileReader()
    
    this.reset()
    this.listen()
  }

  reset(){
    this.innerHTML = `
    Load .eaf file: <input type=file accept=".eaf,.EAF">
    `
  }

  parseELAN(xml){
    let eaf = new DOMParser().parseFromString(xml, 'application/xml')
    let text = parseEAF(eaf)
    
    this.dispatchEvent(new CustomEvent('elan-loaded', {
      bubbles: true,
      detail: text
    }))
    
    this.data = text
  }

  listen(){
    this.fileReader.addEventListener('load', loadEvent => 
      this.parseELAN(loadEvent.target.result)
    )

    this.querySelector('input[type=file]').addEventListener('change', changeEvent => 
      this.fileReader.readAsText(changeEvent.target.files[0])
    )
  }
}

customElements.define('elan-loader', ELANLoader)