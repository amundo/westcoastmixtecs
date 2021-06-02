export class AudioRecorder extends HTMLElement {
  static get observedAttributes(){
    return ['audio-file-name']
  }

  constructor(){
    super()
    this.chunks = []
    this.reset()
  }


  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == 'audio-file-name'){
      this.saveAs = newValue.endsWith('.ogg') ? newValue : newValue + '.ogg'
    } else {
      this.saveAs = 'audioFile.ogg'
    }
  }

  reset(){
    this.innerHTML = `
      <button id=record>record</button>
      <button id=stop>stop</button>
      <div class=clips></div>
    `
  }

  async instantiate(){ 
    try {
      let stream = await navigator.mediaDevices.getUserMedia({audio:true})
      this.mediaRecorder = await new MediaRecorder(stream)
    } catch(e) {
      console.log(e)
    }
    return
  }

  async listen(){
    this.querySelector('button#record').addEventListener('click', async clickEvent => {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({audio:true})
        this.mediaRecorder = await new MediaRecorder(stream)  
        this.mediaRecorder.start()
      } catch(e){
        console.log(e)
      }
      clickEvent.target.textContent = 'recording…'
    })

    this.querySelector('button#stop').addEventListener('click', clickEvent => {
      this.mediaRecorder.stop()
      this.querySelector('button#record').textContent = 'stopped.'
    })

    this.mediaRecorder.addEventListener('dataavailable', dataavailableEvent => {
      this.chunks.push(dataavailableEvent.data)
    })
      
    this.mediaRecorder.addEventListener('stop', stopEvent => {
      let audio = document.createElement('audio')
      let a = document.createElement('a')

      let blob = new Blob(this.chunks, {type: 'audio/ogg; codecs=opus'})

      audio.controls = true
      audio.src = URL.createObjectURL(blob)

      this.querySelector('.clips').append(audio)

      a.download = this.saveAs
      a.href = objectURL 
      a.textContent = this.saveAs
      this.querySelector('.clips').append(a)

      this.chunks = [] 
    })
  }
}

customElements.define('audio-recorder', AudioRecorder)
 
 