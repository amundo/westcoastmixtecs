import { DataViewer } from './DataViewer.js'

export class DataEditor extends HTMLElement {
  connectedCallback(){
    if (this.textContent.trim().length) {    
      try {
        this.data = JSON.parse(this.textContent.trim())
      } catch(e) {
        this.error = e
      }
    }  
    console.log(this.textContent)

    this.innerHTML = `    
      <textarea placeholder="Type JSON here. Escape key to format."></textarea>
      <data-viewer></data-viewer>
      <pre class=data-editor-error></pre>
    `

    this.textarea = this.querySelector('textarea')
    this.dataViewer = this.querySelector('data-viewer')
    this.pre = this.querySelector('pre')

    if(this.data){
      this.dataViewer.data = this.data
      this.textarea.value = JSON.stringify(this.data,null,2)
    }

    this.listen()
  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render(){

  }

  listen(){
    this.textarea.addEventListener('keyup', e => {
      try {
        let data = JSON.parse(textarea.value)
        if (e.key == 'Escape') {
          this.textarea.value = JSON.stringify(data, null, 2)
        }
        
        this.dataViewer.data = data

        this.pre.textContent = ""
        // copyLink.value = `https://docling.net/book/js/try-data-viewer.html#${encodeURIComponent(JSON.stringify(data))}`
      } catch (e) {
        this.pre.textContent = e
      }
    })
  }
}

customElements.define('data-editor', DataEditor)
let textarea = document.querySelector('textarea')
let dataViewer = document.querySelector('data-viewer')
let pre = document.querySelector('pre')
// let fileInput = document.querySelector('input[type=file')
// let copyLinkButton = document.querySelector('button#copy-link-button')
let copyLink = document.querySelector('input#copy-link')

