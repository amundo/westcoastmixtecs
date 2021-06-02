export class TagListEditor extends HTMLElement {
  constructor(){
    super()
    let randomNumber = Math.floor(Math.random() * 10000)
    this.innerHTML = `
      <input class=tag-editor list="list-${randomNumber}">
      <ol class=tag-list>
      </ol>
      <datalist id=list-${randomNumber}></datalist>
    `

    this.tags = [] 
    this.listen()
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return []
  }

  attributeChangedCallback(attribute, oldValue, newValue){

  }

  render(){ 
    this.querySelector('ol.tag-list').innerHTML =``
    this.querySelector('datalist').innerHTML =``

    this.tags.forEach(tag => {
      let li = document.createElement('li')
      li.textContent = tag
      this.querySelector('ol.tag-list').append(li)

      let option = document.createElement('option')
      option.value = tag
      this.querySelector('datalist').append(option)

    })
  }

  get data(){
    return this.tags
  }

  set data(tags){
    this.tags = tags
  }

  add(tag){
    if(!this.tags.includes(tag) && tag.trim().length > 0 ){
      this.tags.push(tag)
    }
  }

  listen(){
    this.addEventListener('keyup', keyupEvent => {
      if(keyupEvent.key == 'Enter'){
        let newTag = this.querySelector('input').value.trim()
        keyupEvent.target.value = ""
        keyupEvent.target.focus()
        
        this.add(newTag)
        this.render()
      }

    })
  }
}

customElements.define('tag-list-editor', TagListEditor)

