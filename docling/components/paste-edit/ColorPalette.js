export class ColorPalette extends HTMLElement {
  constructor(){
    super()
    this.colors = `lavender lemonchiffon aliceblue lightblue mintcream`.split` `
    this.listen()
  }

  connectedCallback(){
    this.render()
  }

  static get observedAttributes(){
    return ['colors']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'colors'){
      this.colors = newValue.trim().split(/[ ,]+/g).map(color => color.trim())
    }
  } 

  render(){
    this.colors.forEach((color,i) => {
      let label = document.createElement('label')
      label.classList.add('color-option')
      label.for = `color-${color}`
      label.style.backgroundColor = color;
      label.innerHTML = `<input type=radio name=color value="${color}" id="color-${color}">`
      
      if(i === 0){ label.querySelector('input').checked = true }

      this.append(label)
    })
  }

  get value(){
    return this.querySelector(".selected input").value
  }

  select(colorOption){
    this.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'))
    colorOption.classList.add('selected')
    this.dispatchEvent(new CustomEvent('change-color', {
      bubbles: true
    }))
  }

  listen(){
    this.addEventListener('click', clickEvent => {
      if(clickEvent.target.matches('.color-option')){
        this.select(clickEvent.target)
      }
    })
  }
}

customElements.define('color-palette', ColorPalette)