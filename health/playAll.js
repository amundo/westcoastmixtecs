
let playAll = () => {
  let audios = Array.from(document.querySelectorAll('audio'));
  audios.slice(0,-1).forEach((audio,i) => {
    audio.addEventListener('ended', endedEvent => {
      audios[i+1].play()
    })
  })

  audios[0].play()
}

let playAllButton = document.querySelector('button#playAll');
playAllButton.addEventListener('click', playAll)
