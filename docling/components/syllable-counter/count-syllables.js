let isVowel = c => `aeiou`.includes(c.toLowerCase())

let tokenize = text => text.normalize("NFKD")
  .split(/[\p{White_Space}|\p{Punctuation}]+/gu)



let countSyllables1 = word => {
  return word
    .split(/(\p{Letter})/gu)
    .filter(letter => isVowel(letter))
    .filter(Boolean)
    .length
}


let scanLines = text => text
  .trim()
  .split('\n')
  .map(line => { 
    let tokens = tokenize(line)
    let count = tokens.reduce((count, token) => { 
      count += countSyllables1(token)
      return count
    }, 0) 

    return {count, tokens: tokens.join(' ')}
  })


export {
  tokenize,
  countSyllables1,
  scanLines
}