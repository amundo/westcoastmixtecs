export class VideoLoader extends HTMLElement {
  static get observedAttributes(){
    return ['src']
  }

  constructor(){
    super()
    this.reset()
    this.listen()
  }

  set controls(boolean){
    boolean ? this.querySelector('video').setAttribute('controls', true) : 
    this.querySelector('video').removeAttribute('controls') 
  }

  get src(){
    return this.querySelector('video')
  }

  set src(src){
    this.querySelector('video').src = src
  }

  get src(){
    return this.querySelector('video')
  }

  reset(){
    this.innerHTML = `
      Load video: <input type=file>
      <video controls></video>
    `
  }

  listen(){
    this.addEventListener('change', e => this.load(e.target.files[0]))
  }


  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'src'){
      this.querySelector('video').src = newValue
    }
  }

  load(file){
    let type = file.type
    let fileName = file.name
    let fileURL = URL.createObjectURL(file)
    this.querySelector('video').src = fileURL
  }
}

customElements.define('video-loader', VideoLoader)
