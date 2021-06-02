class VideoNote extends HTMLElement {
  constructor(){
    super()
    this.notes = [] 
    this.listen()
    this.innerHTML = `
      <form>
       <textarea></textarea>
<button type=submit>add</button>
      </form>
      <style>video-note {
         position:fixed;width:20%;top:0;right:0;background:white;padding:1em;border:4px solid gainsboro;border-radius:5;display:grid;place-contents:center;
      }</style>
     `
     this.video = document.querySelector(`video`)
  }

   toggle(){
     if(this.video.paused){ 
        this.video.play()
     } else {
       this.video.pause()
     }
  }
  
  listen(){
    this.addEventListener('submit', submitEvent => {
      submitEvent.preventDefault()
     
      let note = this.querySelector("textarea").value
      let time = this.video.currentTime
      this.notes.push({note,time})

      this.querySelector('textarea').value = ''
      this.querySelector('textarea').focus()
    })
    this.addEventListener('keyup', keyupEvent => {
      if(keyupEvent.key == 'Escape'){ this.toggle() }
    })
  }
}

customElements.define('video-note', VideoNote)

vn = new VideoNote()
copy({metdata: {title: "Fulani Pronouns", url: document.location.href},notes: vn.notes})
document.body.append(vn)