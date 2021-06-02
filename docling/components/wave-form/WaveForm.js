export class WaveForm extends HTMLElement {
  constructor() {
    super()
    this.audioContext = new AudioContext // probably wrong place for this…
    this.listen()
  }

  connectedCallback() {

  }

  static get observedAttributes() {
    return ['size']
  }

  // get data(){

  // }

  filterData(audioBuffer) {
    const rawData = audioBuffer.getChannelData(0)
    const samples = 200
    const blockSize = Math.floor(rawData.length / samples)
    const filteredData = []
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j])
      }
      filteredData.push(sum / blockSize)
    }
    return filteredData
  }

  normalizeData(data, windowSize = 100) {
    let multiplier = Math.pow(Math.max(...data), -1)
    let normalizedData = data.map(n => n * multiplier)
    let percentages = normalizedData.map(datum => Math.floor(datum * 100))

    return percentages
  }

  select(){

  }

  set size(size = 100) {
    this.windowSize = size
  }

  set data(audioBuffer) {
    this.audioBuffer = audioBuffer
    this.filteredData = this.filterData(audioBuffer)
    this.percentages = this.normalizeData(this.filteredData, this.windowSize)
    this.render()
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute == 'size') {
      this.windowSize = parseInt(newValue)
    }
  }

  render() {
    this.innerHTML = this.percentages
      .map(p => `<span class=bar style="height:${p}%"> </span>`)
      .join('\n')
  }

  async readAudioFile(loadEvent) {
    const file = loadEvent.target.files[0]
    if (file) {
      let arrayBuffer = await new Response(file).arrayBuffer()
      let audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.data = audioBuffer
    }
  }

  listen(){
    this.addEventListener('load', loadEvent => {
      this.readAudioFile(loadEvent.target.files[0])
    })
  }
}

customElements.define('wave-form', WaveForm)
