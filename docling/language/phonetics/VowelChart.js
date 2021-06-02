export class VowelChart extends HTMLElement {
  static get observedAttributes(){
    return ['src']
  }

  constructor(){
    super()
    this.backnesses = [
      "front",
      "near-front",
      "central",
      "near-back",
      "back"
    ]
    this.heights = [
      "close",
      "near-close",
      "close-mid",
      "mid",
      "open-mid",
      "near-open",
      "open"
    ]
    this.roundings = [
      "unrounded",
      "rounded"
    ]
  }

  connectedCallback(){

  }

  attributeChangedCallback(attribute, oldValue, newValue){
   if(attribute == 'src'){
     this.fetch(newValue)
   }
  }

  fetch(src){ 
    fetch(src)
      .then(response => response.json())
      .then(vowels => {
        this.vowels = vowels
      })
      .then(() => this.render())
  }

  disconnectedCallback(){

  }

  render(vowels=this.vowels){
    let table = document.createElement('table')
    table.id = 'vowel-chart'
    table.classList.add('ipa-chart')
    table.innerHTML = `<thead><tr><th></th></tr></thead>
    <tbody></tbody>
    `
    let tbody = table.querySelector('tbody')
    let thead = table.querySelector('thead')

    this.backnesses.forEach(backness => {
      let th = document.createElement('th')
      th.textContent = backness
      thead.rows[0].append(th)
    })
    
    this.heights.forEach(height => {
      let tr = document.createElement('tr')
      tbody.append(tr)
      let th = document.createElement('th')
      th.textContent = height
      tr.append(th)

      this.backnesses.forEach(backness => {  
        let td = document.createElement('td')
        tr.append(td)
        this.roundings.forEach(rounding => {
          let span = document.createElement('span')
          td.append(span)
          span.dataset.backness = backness
          span.dataset.height = height
          span.dataset.rounding = rounding
          td.append(span)
        })
        
      })
    })
    let spans = [...table.querySelectorAll('span')]

    vowels.forEach(({backness, height, rounding, letter}) => {
      let span = spans.find(span => span.dataset.backness == backness && 
        span.dataset.height == height && 
        span.dataset.rounding == rounding )

      span.classList.add('ipa-vowel')
      span.textContent = letter
    })

    this.innerHTML = ``
    this.append(table)
  }
}

customElements.define('vowel-chart', VowelChart)