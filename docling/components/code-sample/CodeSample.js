let toLineDivs = code => {
  code = code
    .replace(/^\n+/g, '') // remove blank leading newlines, but not spaces on the first line
    .trimEnd() // remove trailing whitespace

  let lines = code
    .split('\n')
  
  lines[0] = lines[0].trim()

  lines = lines
    .slice(lines.findIndex(line => line.trim().length > 0))

  return lines.map((line,i) => 
    `<div class=code-line data-line-number="${i+1}">${line}</div>`
  )
    .join('')
}

export class CodeSample extends HTMLElement {
  constructor(){
    super()
    this.code = this.textContent
  }

  static get observedAttributes(){
    return ['src']
  }

  connectedCallback(){
    this.render()
  }


  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'src'){ 
      fetch(newValue)
        .then(request => request.text())
        .then(code => this.code = code)
        .then(() => this.render())
    }
  }

  render(){
    this.innerHTML = ``
    let codeLinesWithDivsHTML = toLineDivs(this.code)
    let pre = document.createElement('pre')
    let code = document.createElement('code')
    pre.append(code)
    code.innerHTML = codeLinesWithDivsHTML
    this.append(pre)    
  }

  listen(){

  }
}

customElements.define('code-sample', CodeSample)