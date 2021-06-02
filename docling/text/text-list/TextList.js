import {TextView} from '../text-view/TextView.js'
import {TextEditor} from '../text-editor/TextEditor.js'

export class TextList extends HTMLElement {
  constructor(){
    super()
  this.texts = [] 
    this.listen()
    this.render()
  }

  connectedCallback(){

  }

  set data(texts){
    this.texts = texts
    this.render()
  }

  get data(){
    return this.texts
  }

  render(){
    this.texts.forEach(text => {
      let textView = new TextView()
      textView.data = text
      this.append(textView)
    })
  }

  listen(){
    this.addEventListener('click', clickEvent => {
      if(clickEvent.target.matches('text-view')){
        this.dispatchEvent('wtf')
      }
    })
  }
}

customElements.define('text-list', TextList)