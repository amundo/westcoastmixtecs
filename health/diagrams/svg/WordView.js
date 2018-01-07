class WordView {
  constructor(word, el=document.createElement("div")){
    this.word = word
    this.el = el
    this.el.classList.add("word")
    this.listen()
  }

  render(){
    this.el.innerHTML = `
      <p class=form><span>${this.word.form}</span></p>
      <p class=gloss><span>${this.word.gloss}</span></p>
    `
    return this.el
  }

  edit(){
    this.el.innerHTML = `
      <p class=form><input name=form value="${this.word.form}"></p>
      <p class=gloss><input name=gloss value="${this.word.gloss}"></p>
    `
  }

  read(){
    let form = this.el.querySelector('.form input').value 
    let gloss = this.el.querySelector('.gloss input').value 

    return { form, gloss }
  }

  update(event){
    this.word = this.read()
    this.render()
  }

  listen(){
    this.el.addEventListener("click", clickEvent => {
      if(clickEvent.currentTarget.matches('.word') && clickEvent.shiftKey){ 
        this.edit() 
      }
    })
   
    this.el.addEventListener("keyup", keyupEvent => { 
      if(keyupEvent.currentTarget.matches('.word') && keyupEvent.key == 'Enter'){ 
        this.update()
      }
    })
  }
}
