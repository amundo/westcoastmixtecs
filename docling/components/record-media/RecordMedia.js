export class RecordMedia extends HTMLElement {
  constructor(){
    super()
    this.mediaRecorder = null
    this.listen()
  }

  static get observedAttributes(){
    return ['media-file-name']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'media-file-name'){
      this.mediaFileName = newValue
    }
  }

  connectedCallback(){
    this.innerHTML = `
      <label><input checked type=checkbox name=audio> audio</label>
      <label><input type=checkbox name=video> video</label>
      <button disabled class=state-button>record</button>
      <a href=# download=recorded-media.webm>download recording</a>
    `

    this.initialize()
  }

  async initialize(){
    this.blobs = []

    let stream = await navigator.mediaDevices.getUserMedia(this.options)
    this.mediaRecorder = await new MediaRecorder(stream)

    this.dispatchEvent(new Event('ready', {
      bubbles:true
    }))

    this.mediaRecorder.addEventListener('dataavailable', e => {
      this.blobs.push(e.data)
    })

    this.querySelector('button.state-button').removeAttribute('disabled')
  }

  get currentTime(){
    let now = new Date(Date.now()) / 1000 // return seconds

  }

  get options(){
    let audio = this.querySelector('input[name=audio]').checked
    let video = this.querySelector('input[name=video]').checked

    let options = {}

    if(audio){ options.audio = true }
    if(video){ options.video = true }

    return options
  }
 
  render(){
    if(this.options.audio && !this.options.video){
      let audio = document.createElement('audio')
      audio.controls = true
      audio.src = URL.createObjectURL(new Blob(this.blobs))
      audio.addEventListener('canplaythrough', e => {
        this.after(audio)
      })
    } else if(this.options.video){
      let video = document.createElement('video')
      video.controls = true
      let blob = new Blob(this.blobs, {type: "application/octet-stream"});
      let url = URL.createObjectURL(blob)
      video.src = url  
      video.addEventListener('canplaythrough', e => {
        this.after(video)
      })

    }
  }

  listen(){
    this.addEventListener('click', e => {
      if(e.target.matches('.state-button')){
        if(this.mediaRecorder.state == 'inactive'){
          this.mediaRecorder.start()
          e.target.textContent = 'stop'
        } else if(this.mediaRecorder.state == 'recording'){
          this.mediaRecorder.stop()
          this.mediaRecorder.addEventListener('stop', e => this.render())

          e.target.textContent = 'done'
        }

        this.state == this.mediaRecorder.state
      }

      if(e.target.matches('[download]')){
        let link = e.target
        if(this.mediaFileName){
          link.setAttribute('download', this.mediaFileName)
        }
        link.href = URL.createObjectURL(new Blob(this.blobs))
        link.click()
      }
    })



    this.addEventListener('change', e => {
      if(e.target.matches('input[type=checkbox]')){
        this.initialize()
      }
    })
  }
}

customElements.define('record-media', RecordMedia)

