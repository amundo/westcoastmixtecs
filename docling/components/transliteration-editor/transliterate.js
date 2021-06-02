let  escape = unescaped => { // do we really need this?
  if(typeof unescaped != 'string'){ 
    throw new TypeError(`alphabet in definition not a string: ${unescaped}`) 
  }

  return unescaped.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1")
}

let phonemize = (text, orthography, orthographyName) => {
  let phonemes = orthography.map(phoneme => phoneme[orthographyName])
  phonemes.sort((a,b) => (a.length < b.length) ? 1 : -1)

  phonemes = phonemes.map(phoneme => escape(phoneme))

  let pattern = `(${phonemes.join('|')})`
  let splitter = new RegExp(pattern, 'g')

  return text
    .split(splitter)
    .filter(x => x)
}

let transliterate = (text, orthography, from, to) => {
  // let substitutions = {}

  // orthography.forEach(letter => 
  //   substitutions[letter[from]] = letter[to]
  // )

  let substitutions = orthography.reduce((substitutions, letter) => {
    substitutions[letter[from]] = letter[to]  
    return substitutions
  }, {})

  let phonemeList = phonemize(text, orthography, from)

  return phonemeList
    .map(phoneme => 
      substitutions[phoneme] ? substitutions[phoneme] : phoneme
    )
    .join('')
}


export {transliterate}