import {WordForm} from '../../corpus/word-form/WordForm.js'

export class DiagramLabeler extends HTMLElement {
  constructor(){
    super()
    this.ns = "http://www.w3.org/2000/svg"
    this.innerHTML = `
      <div class=add-label>
        <word-form></word-form>
      </div>
      <figure>
        <figcaption><input type=file accept="image/svg+xml"></figcaption>
      </figure>
    `
    this.listen()
  }

  connectedCallback(){

  }
  

  addLabel({form,gloss,x,y}){
    let transformed = this.transform({x,y})

    this.querySelector('svg').insertAdjacentHTML('beforeend', 
    `<text x="${transformed.x}" y="${transformed.y}" fill="yellow">
      <tspan class="form">${form}</tspan>
      <tspan class="gloss">${gloss}</tspan>
    </text>`)
  }


  transform({x, y}){
    let point = this.querySelector('svg').createSVGPoint()
    point.x = x
    point.y = y
    let transformedPoint = point.matrixTransform(this.querySelector("svg").getScreenCTM())
    return {
      x: transformedPoint.x,
      y: transformedPoint.y,
    }
 }


  addForeignObjectLabel({form,gloss,x,y}){ // wasn’t happy with this
    let foreignObject = `<foreignObject width="30" height="20" x="${x}" y="${y}">
      <div class="word-label" xmlns="http://www.w3.org/1999/xhtml">
        <input class="form" value="${form}"></input>
        <input class="gloss" value="${gloss}"></input>
      </div>
    </foreignObject>`

    this.querySelector('svg').insertAdjacentHTML("beforeend", foreignObject)
  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render(){

  }

  insertSVG(svg){
    let figure = this.querySelector('figure')
    let figcaption = this.querySelector('figcaption').cloneNode(true)
    
    figure.innerHTML = ``
    
    figure.append(figcaption)
    figure.insertAdjacentHTML('beforeend', svg)

    this.adjustSVGDimensions()
  }

  adjustSVGDimensions(){
    let svg = this.querySelector('svg')
    svg.removeAttribute('width')
    svg.removeAttribute('height')
    svg.setAttribute('width', 'auto')

  }

  listen(){
    this.addEventListener('change', changeEvent => {
      if(changeEvent.target.matches(`input[type=file]`)){
        let file = changeEvent.target.files[0]
        let fileReader = new FileReader()
        fileReader.addEventListener('load', loadEvent => {
          let svg = loadEvent.target.result
          this.insertSVG(svg)
        })
        fileReader.readAsText(file)
      }
    })

    this.addEventListener('change', changeEvent => {
      if(changeEvent.target.matches(`input[type=file]`)){
        let file = changeEvent.target.files[0]
        let fileReader = new FileReader()
        fileReader.addEventListener('load', loadEvent => {
          let svg = loadEvent.target.result
          this.insertSVG(svg)
        })
        fileReader.readAsText(file)
      }
    })

    this.addEventListener('pointerdown', pointerdownEvent => {

    })

    this.addEventListener('pointerdown', pointerdownEvent => {
      
    })
  }
}

customElements.define('diagram-labeler', DiagramLabeler)