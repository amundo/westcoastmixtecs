export class SortEditor extends HTMLElement {
  constructor(){
    super()

    this.innerHTML = `
      <form class=sort-editor-form>
        Sort on: 
        <select name=sort-key>
        </select>
      </form>
    `

    // <label><input type=checkbox name=compare-from-end value=false> Compare from end?</label> 

    this.listen()
  }

  connectedCallback(){

  }

  read(){
    let formData = new FormData(this.querySelector('form'))
    let entries = Array.from(formData.entries())
      .filter(([key,value]) => value)
      .map(([key,value]) => [this.camelize(key), value])

    return Object.fromEntries(entries)  
  }

  set data(options){
    this.options = options
    this.render()
  }

  get data(){
    return this.read()
  }

  static get observedAttributes(){
    return ['sortable-keys']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(this.querySelector(`[name=${attribute}]`)){
      this.querySelector(`[name=${attribute}]`)
        .value = newValue
    }

    if(attribute == 'sortable-keys'){
      this.sortableKeys = newValue.split(/[, ]+/g).map(x => x.trim())
      this.render()
    }
  }

  camelize(snake){
    return snake.split("-")
      .reduce((camel, item, i) => {
        if(i === 0){ camel = item }
        else{ camel += item[0].toUpperCase() + item.slice(1).toLowerCase() }
        return camel
      })
  }

  render(){
    this.sortableKeys.forEach(sortableKey => {
      let option = document.createElement("option")
      option.value = sortableKey
      option.textContent = sortableKey
      this.querySelector('select[name=sort-key]')
        .append(option)
      // <option value=form>form</option>

      // <option value=gloss>gloss</label>
  
    })

  }

  listen(){
    this.addEventListener('change', changeEvent => { 
      let sortEditedEvent = new Event('sort-edited', {bubbles: true})
      this.dispatchEvent(sortEditedEvent)
    })
  }
}

customElements.define('sort-editor', SortEditor)



/*


        <!--
        <select name=direction> 
          <option value=ascending>alphabetical</option>
          <option value=descending>reverse alphabetical</option>
        </select>
        -->

        <!--
        <label><input type=checkbox name=ignore-punctuation value=true> Ignore punctuation?</label>
        <label><input type=checkbox name=diacritics value=true> Diacritics</label>
        <label><input type=checkbox name=case value=true> Case</label>
        -->

        */