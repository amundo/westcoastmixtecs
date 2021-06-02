export class OrthographicInput extends HTMLElement {
  static get observedAttributes(){
    return ['orthography']
  }

  get help(){
    return `
    An orthography, here, is an array of graphemes, equivalent to 

    orthography.map(correspondence => correspondence[someOrthographicCode])

    Accessing the .graphemes getter will return the input’s value split into
    graphemes from that orthography.
    `
  }

  constructor(){
    super()
    
  }

  set orthography(correspondences, orthographicCode){
    this.graphemes = correspondences.map(correspondence => correspondence[orthographicCode])
  }

  graphemize(text){
    let graphemesByLength = this.graphemes.sort((a,b) => a.length < b.length)
        
    pattern = `(${graphemesByLength.join('|')})`
    
    re = new RegExp(pattern, 'g')
    
    text.split(re).filter(Boolean)    graphemesByLength.find(grapheme => text.startsWith(grapheme))
  }

  get repertoire(){
    this.orthography.map
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'orthography'){
      this.orthography = newValue
    }
  }
}

customElements.define('orthographic-input', OrthographicInput)