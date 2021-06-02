export class YoutubeNote extends HTMLElement {
  constructor(){
    super()
    this.text = {}
    this.innerHTML = `
    <p>https://www.youtube.com/embed/tAo6k39YahY</p>
      <input name=youtube-url>
    `
    this.listen()
  }

  connectedCallback(){

  }

  set data(youtubeURL){
    this.youtubeURL = youtubeURL
    console.log(youtubeURL)
    this.render()
  }

  get data(){
    return this.youtubeURL
  }

  static get observedAttributes(){
    return ['url']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'url'){
      this.data = newValue
    }
  }

  renderIframe(){
    let iframe = document.createElement('iframe')
    let tag = `
      <iframe 
        width="560" 
        height="315" 
        src="${this.data}"
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
      </iframe>
    `
console.log(tag)
    this.append(iframe)

  }

  render(){
    this.renderIframe()
  }

  listen(){
    this.addEventListener('change', changeEvent => {
      this.data = changeEvent.target.value
    })
  }
}

customElements.define('youtube-note', YoutubeNote)






