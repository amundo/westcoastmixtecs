export class WordEditor extends HTMLElement {
  constructor(){
    super()

    this.innerHTML = `
    <form class=word-form>
      <input name=form placeholder=form >
      <input name=gloss placeholder=gloss >
      <button type=submit>Add</button>
    </form>
    `

    this.autosize = false
    this.word = {}
    this.listen()
  }
  

  connectedCallback(){
    this.render()
  }

  static get observedAttributes(){
    return ['form', 'gloss', 'autosize']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'form'){ 
      this.word.form = newValue
    }

    if(attribute == 'gloss'){ 
      this.word.gloss = newValue
    }

    if(attribute == 'autosize'){ 
      this.autosize = true 
    }
  }

  set data(word){
    this.word = word
    this.render()
  }

  get data(){
    return this.read()
  }

  read(){ // generalize
    let inputs = Array.from(this.querySelectorAll('input[name]'))
    let word = inputs.reduce((word, input) => {
        word[input.name] = input.value
        return word
      }, {})

    return word
  }

  clear(){
    this.querySelectorAll('input').forEach(input => {
      input.value = ''
    })
    // this.querySelector('input').focus()
  }

  get morphemes(){
    let {form,gloss} = this.data

    let forms = form.split(/[-]/g)
    let glosses = gloss.split(/[-]/g)

    return forms
      .map((_,i) => ({
        form: forms[i],
        gloss: glosses[i]
      }))
  }

  render(){ // generalize this
    Object.entries(this.word).forEach(([property,value]) => {
      let input = this.querySelector(`input[name="${property}"]`)
      input.value = value
      this.setAttribute(property, value)
    })

    if(this.autosize){
      this.fitText()
    }
  }
  
  submit(){
    this.data = this.read()
    this.dispatchEvent(new CustomEvent('word-editor-submit', {bubbles:true}))
  }

  get maxValueLength(){
    let inputs = Array.from(this.querySelectorAll('input'))
    let valueLengths = inputs.map(input => input.value.length)
    return Math.max(...valueLengths)
  }

  fitText(){
    this.querySelectorAll('input[name]').forEach(input => {
      input.style.width = `${this.maxValueLength + 1}ch`
    })
  }
  
  listen(){
    this.addEventListener('input', inputEvent => {
      if(this.autosize){
        this.fitText()
      }
    })

    this.querySelector('form').addEventListener('submit', submitEvent  => {
      submitEvent.preventDefault()
      this.submit()
    })
  }
}

customElements.define('word-editor', WordEditor)