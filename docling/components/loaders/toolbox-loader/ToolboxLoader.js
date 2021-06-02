export class ToolboxLoader extends HTMLElement {
  static get observedAttributes(){
    return ['src']
  }

  constructor(){
    super()
console.log(`wtf`)
    this.fileReader = new FileReader()

    this.reset()
    this.listen()
  }

  get src(){
    return this.querySelector('video')
  }

  reset(){
    this.innerHTML = `
      <input type=file accept=".tbt,.TBT">
    `
  }

  parseBlock(block){
    return block
      .trim()
      .split("\n")
      .map(line => line.slice(1))
      .reduce((object, line) =>  { 
        let [key,content] = [line.split(' ')[0].trim(), line.split(' ').slice(1).join(' ')]
        object[key] = content
        return object 
      }, {})
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'src'){
      this.querySelector('video').src = newValue
    }
  }

  parseToolbox(toolbox){
    let blocks = toolbox.trim().split('\n\n')
    let uselessPrologBlock = blocks.shift()
    let mediaBlock = blocks.pop()
    let objects = blocks.map(block => this.parseBlock(block))
    this.data = objects
  }

  listen(){
    this.fileReader.addEventListener('load', loadEvent => {
      this.parseToolbox(loadEvent.target.result)
    })
    this.querySelector('input[type=file]').addEventListener('change', changeEvent => {
      this.fileReader.readAsText(changeEvent.target.files[0])
    })
  }
}

customElements.define('toolbox-loader', ToolboxLoader)