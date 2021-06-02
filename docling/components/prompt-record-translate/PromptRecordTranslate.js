import {audioBufferToWav} from './audio-buffer-to-wav.js'
import {WaveForm} from '../wave-form/WaveForm.js'

export class PromptRecordTranslate extends HTMLElement {
  constructor(){
    super()
    this.listen()

    this.audioContext = new AudioContext

    this.words = []
  }

  connectedCallback(){
    this.innerHTML = `
      <header style=display:flex;align-items:space-between;>
      <details class=help-details>
      <summary>help</summary>
      <div>
        <p>This application may be used to record and transcribe translations
        of a series of prompts, creating (1) a single <code>.wav</code> audio file and (2) a 
        time-aligned transcription of the recorded words, with the prompts 
        serving as glosses and the transcribed text as the form. Each may
        be downloaded by clicking “save” at the bottom of the application.</p>
        <p>
        In order to use the application, first click the <code>enable microphone</code>
        button and give permission to access your computer’s microphone. Then record a
        recitation of the translation of the given prompt by clicking and holding
        the red button. You may hit “play” immediately to evaluate the recording, and you
        may re-record if desired.
        </p>
        <p>
        Next, transcribe each recorded form. Finally, you can download (1) the audio file
        and (2) a time-aligned transcript of your work by clicking on the save menu at the
        bottom of the interface.
        </p>
        </div>
      </details>
      </header>
      <button class=enable-microphone-button>Enable microphone</button> 
      <div class=prompts></div>
      <audio class=combined></audio>
      <details class=save-details>
        <summary>Downloads</summary>
        <ol>
          <li><a download class=download-combined-audio>Download combined audio</a></li>
          <li><a download class=download-transcript>Download time-aligned transcript</a></li>
        </ol>
      </details>
    `
    this.render()

  }

  static get observedAttributes(){
    return ['prompts']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute=="prompts"){
      this.prompts = newValue.split(/[ ,]+/g)
    }
  }

  renderPrompt(prompt){
    let div = document.createElement('div')
    div.classList.add('prompt')
    div.innerHTML = `
      <button class=play-form-button hidden>play</button>
      <span class=prompt-gloss>${prompt}</span>
      <button class="record-form-button disabled">record</button>
      <audio class=form-audio></audio>
      <wave-form></wave-form>
      <input class=form placeholder="Hold red button to record form, then transcribe here." name="${prompt}-form">
    `
    return div
  }

  initialize(){
    this.words = [] 
  }

  render(){
    this.querySelector('.prompts').innerHTML = ``
    this.prompts.forEach(prompt => {
      this.querySelector('.prompts').append(this.renderPrompt(prompt))
      this.words.push({
        gloss: prompt,
        form: "",
        start: 0,
        end: 0
      })
    })
  }

  async blobToAudioBuffer(blob){
    let response = await new Response(blob)
    let arrayBuffer = await response.arrayBuffer()
    let audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    this.querySelector('wave-form').data = audioBuffer
    return audioBuffer
  }

  readForms(){
    this.words.forEach((word,i) => {
      let form = this.querySelectorAll('input.form')[i].value.trim()
      word.form = form
    })
  }

  get data(){
    this.annotateTimeInfo()

    let words = this.words.map(({form,gloss,start,end}) => {
      return {form,gloss,start,end}
    })

    let metadata = {
      "title": 
      `Recorded translations of ‘${this.prompts.slice(0,5).join(', ')}…’`
    }

    return {metadata, words}
  }

  neaten(n, fixed=3){
    return parseFloat((n).toFixed(3))
  }

  annotateTimeInfo(){
    this.words.map((word,i) => {
      if(word.audioBuffer){
        word.duration = word.audioBuffer.duration
        word.start = this.words.slice(0,i)
        .map(word => word.audioBuffer.duration)
        .reduce((a,b) => a + b, 0)
        
        word.start = this.neaten(word.start)
        word.end = word.start + word.duration
        word.end = this.neaten(word.end)
      }
    
      return word
    })
  }

  concatenateAudioBuffer(a, b){ // a and b must be audioBuffers
    let numberOfChannels = Math.min( a.numberOfChannels, b.numberOfChannels )
    let tmp = this.audioContext.createBuffer( numberOfChannels, (a.length + b.length), a.sampleRate )

    for (let i=0; i < numberOfChannels; i++) {
      let channel = tmp.getChannelData(i)
      channel.set( a.getChannelData(i), 0)
      channel.set( b.getChannelData(i), a.length)
    }

    return tmp
  }
  
  createTranscript(){
    let downloadTranscriptLink = this.querySelector('.download-transcript') 
    downloadTranscriptLink.download = "wordlist.json"
    let json = JSON.stringify(this.data, null, 2)

    downloadTranscriptLink.href = URL.createObjectURL(new Blob([json]))
  }

  createCombinedWAV(){
    let audio = this.querySelector('audio.combined')
    let wavBuffer = audioBufferToWav(this.combinedBuffer)
    let downloadAudioLink = this.querySelector('.download-combined-audio') 
    downloadAudioLink.download = "wordlist.wav"

    audio.controls = true
    this.querySelector('audio.combined').src = URL.createObjectURL(new Blob([wavBuffer]))
    downloadAudioLink.href = URL.createObjectURL(new Blob([wavBuffer]))

  }

  combineAudioBuffers(){
    this.combinedBuffer = this.words
      .map(word => word.audioBuffer)
      .reduce((combined, buffer) => this.concatenateAudioBuffer(combined, buffer))
    this.createCombinedWAV()
  }

  update(){
    this.readForms()
    this.annotateTimeInfo()
  }

  enableButtons(){
    this.querySelectorAll('button')
      .forEach(button => {
        button.classList.remove('disabled')
        //button.hidden = false
      })
  }

  listen(){
    this.addEventListener('click', clickEvent => {

      if(clickEvent.target.matches('.enable-microphone-button')){
        navigator.mediaDevices
          .getUserMedia({audio:true})
          .then(stream => this.mediaRecorder = new MediaRecorder(stream))
          .then(() => this.enableButtons())
      }

      if(clickEvent.target.matches('.play-form-button')){
        let button = clickEvent.target
        let promptDiv = button.closest('div.prompt')
        let audio = promptDiv.querySelector('audio')
        audio.play()
      }

      if(clickEvent.target.matches('.download-combined-audio')){
        this.combineAudioBuffers()

      }

      if(clickEvent.target.matches('.download-transcript')){
        console.log(`dltrx`)
        this.createTranscript()
      }

    })

    this.addEventListener('mousedown', mousedownEvent => {
      if(mousedownEvent.target.matches(".record-form-button")){
        this.mediaRecorder.start()
      }
    })

    this.addEventListener('mouseup', mouseupEvent => {
      if(mouseupEvent.target.matches(".record-form-button")){
        let promptDiv = mouseupEvent.target.closest(".prompt")
        let audio = promptDiv.querySelector("audio")
        let prompt = promptDiv.querySelector(".prompt-gloss").textContent
        let playButton = promptDiv.querySelector(".play-form-button")
        
        let word = this.words.find(word => word.gloss == prompt)

        let saveAudio = dataavailableEvent => {
          let blob = dataavailableEvent.data

          word.blob = blob
          this.blobToAudioBuffer(word.blob)
            .then(audioBuffer => { word.audioBuffer = audioBuffer;})
            .then(() => this.update())
          audio.src = URL.createObjectURL(new Blob([blob]))
          playButton.hidden = false
          
        }
        this.mediaRecorder.addEventListener("dataavailable", saveAudio, {once:true})
        this.mediaRecorder.stop()
      }
    })

    this.addEventListener("keyup", keyupEvent => {
      if(keyupEvent.target.matches("input.form") && keyupEvent.key == 'Escape'){
        keyupEvent.target.closest('div.prompt').querySelector('audio').play()
      }
    })

    this.addEventListener("blur", this.update)
    this.addEventListener("keyup", this.update)

  }
}

customElements.define('prompt-record-translate', PromptRecordTranslate)
