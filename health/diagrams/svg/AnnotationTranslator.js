class AnnotationTranslator {
  constructor(url, el=document.querySelector('.annotator')){
    this.el = el
    this.url = url
    this.figure = this.el.querySelector('.diagram figure')
    this.figCaption = this.el.querySelector('.diagram figcaption')

    this.glossStrong = this.el.querySelector('.word strong.gloss')
    this.formInput = this.el.querySelector('.word input.form')

    this.lexicon = new Lexicon 
    this.lexiconView = new LexiconView(this.lexicon, document.querySelector('.lexicon'))
    this.load()

    this.listen()
  }

  get labels(){
    let labels = this.tSpans ? this.tSpans : this.textNodes
  }

  get textNodes(){
    return [...this.svg.querySelectorAll('text')]
  }

  get tSpans(){
    return [...this.svg.querySelectorAll('tspan')]
  }

  get word(){
    return {
      gloss: this.glossStrong.textContent,
      form: this.formInput.value
    }
  }

  tSpanByGloss(gloss){
    console.log(gloss)
    let tSpan = this.svg.querySelector(`[data-gloss="${gloss}"]`)
    return tSpan
  }

  saveWord(){
    this.lexicon.add(this.word)
    this.formInput.value = ''
    this.glossStrong.textContent = 'Choose another word…'
    this.updateDiagram()
    this.lexiconView.render()

    this.formInput.placeholder = ''
  }

  listen(){
    this.el.addEventListener('click', clickEvent => {
      if(clickEvent.target.matches('.gloss')){
        let gloss = clickEvent.target.textContent.trim()
        this.glossStrong.textContent = gloss
        this.formInput.focus()
      }
    })

    this.formInput.addEventListener('keyup', keyupEvent => {
      if(keyupEvent.key == 'Enter'){
        this.saveWord()
      }
    })
  }

  updateDiagram(){
    this.lexicon.words.forEach(word => {
      let tSpan = this.tSpanByGloss(word.gloss)
      tSpan.classList.toggle('gloss')
      tSpan.textContent = word.form
    })
  }

  initialize(){
    this.tSpans.forEach(tSpan => {
      tSpan.dataset.gloss = tSpan.textContent.trim()
      tSpan.removeAttribute('style')
      tSpan.classList.toggle('gloss')
    })

    this.formInput.dataset.keys.split(` `).forEach(key => {
      this.formInput.insertAdjacentHTML('afterend', `
        <button class=form-input-key>${key}</button>
      `)
    })

    this.el.querySelectorAll('button.form-input-key').forEach(button => {
      button.addEventListener('click', clickEvent => {
        this.formInput.value = (this.formInput.value  + button.textContent).normalize('NFKC')
        this.formInput.focus()
      })
    })
  
  }

  load(){
    fetch(this.url)
      .then(r => r.text())
      .then(svg =>  this.figure.innerHTML = svg)
      .then(() =>  this.svg = this.el.querySelector('svg'))
      .then(() => this.initialize())
  }
}
