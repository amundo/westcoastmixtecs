export class ConsonantChart extends HTMLElement {
  static get observedAttributes(){
    return ['src', 'places', 'manners']
  }

  constructor(){
    super()
    this.places = [
      "bilabial",
      "labiodental",
      "dental",
      "alveolar",
      "palato-alveolar",
      // "postalveolar",
      "retroflex",
      "palatal",
      "velar",
      "uvular",
      "pharyngeal",
      "glottal"
    ]

    this.manners = [
      "aspirated plosive",
      "lateral ejective affricate",
      "lateral ejective fricative",
      "ejective",
      "ejective fricative",
      "fricative",
      "implosive",
      "labialized plosive",
      "palatalized lateral approximant",
      "lateral approximant",
      "lateral fricative",
      "nasal",
      "plosive",
      "tap",
      "trill",
      "approximant",
      "flap",
      "palatalized plosive",
      "affricate",
      "aspirated affricate",
      "ejective affricate",
      "aspirated approximant",
      "prenasalized plosive"
    ]
    
    this.voicings = [
      "voiceless",
      "voiced"
    ]
  }

  get selected(){

  }


  get data(){
    if(this.querySelector('.selected')){
      return this
    }
    return this.consonants
  }

  set src(src){
    this.setAttribute('src', src)
    this.render()
  }


  get src(){
    return this.getAttribute('src')
  }

  connectedCallback(){

  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'src'){
      this.fetch(newValue)
    }
    
    if(attribute == 'places'){
      if(!Array.isArray(places)){
        let places = newValue.split(/[ ,]+/g).map(place => place.trim())
      }
      this.places = places
    }

    if(attribute == 'manners'){
      if(!Array.isArray(manners)){
        let manners = newValue.split(/[ ,]+/g).map(manner => manner.trim())
      }
      this.manners = manners
    }
  }

  isConsonant(phone){
    return ['place', 'manner', 'vocing'].every(feature => phone.has(feature))
  }

  fetch(src){
    fetch(src)
      .then(response => response.json())
      .then(data => {
        if(data.consonants){
          this.consonants = data.consonants
        } else if(Array.isArray(data)){
          this.consonants = data  
        }
      })
      .then(() => this.render())
  }

  disconnectedCallback(){

  }

  render(consonants=this.consonants){
    this.consonants = consonants
    let table = document.createElement('table')
    table.classList.add('consonant-chart')
    table.classList.add('ipa-chart')
    table.innerHTML = `<thead class=vertical-headers><tr><th></th></tr></thead>
    <tbody></tbody>
    `
    let tbody = table.querySelector('tbody')
    let thead = table.querySelector('thead')

    let mannersInData = this.manners
      .filter(manner => consonants.some(consonant => consonant.manner == manner))

    let placesInData = this.places
      .filter(place => consonants.some(consonant => consonant.place == place))

    placesInData.forEach(place => {
      let th = document.createElement('th')
      th.textContent = place
      thead.rows[0].append(th)
    })

    mannersInData.forEach(manner => {
      let tr = document.createElement('tr')
      tbody.append(tr)
      let th = document.createElement('th')
      th.textContent = manner
      tr.append(th)
      placesInData.forEach(place => {
        let td = document.createElement('td')
        tr.append(td)
        this.voicings.forEach(voicing => {
          let span = document.createElement('span')
          td.append(span)
          
          span.classList.add('ipa-consonant')
          span.dataset.place = place
          span.dataset.manner = manner
          span.dataset.voicing = voicing
        })
      })
    })

    let spans = [...table.querySelectorAll('span')]

    consonants.forEach(({place, manner, voicing, letter}) => {
      let span = spans.find(span => span.dataset.place == place && 
        span.dataset.manner == manner && 
        span.dataset.voicing == voicing )
      if(span){ 
        span.textContent = letter 
      } 
    })

    this.innerHTML = ``
    this.append(table)
  }
}

customElements.define('consonant-chart', ConsonantChart)