
class Lexicon {
  constructor(words=[], metadata={}, comparator=null){
    this.words = words

    this.words
      .map(word => new Word(word))
      .forEach(word => { this.add(word) })

    this.metadata = metadata

    this.formIndex = {}
    this.glossIndex = {}

    this.comparator = comparator

    this.sort()
  }

  get forEach(){
    return this.words.forEach
  }

  at(n){
    return this.words[n]
  }

  sort(){
    if(this.comparator){
      this.words.sort(this.comparator)
    } else {
      this.words.sort((a,b) => {
        return a.form > b.form ? 1 : -1
      })
    }
  }

  sortBy(key){
    this.words.sort((a,b) => {
      return a[key] > b[key] ? 1 : -1
    })
  }

  get length(){
    return this.words.length
  }

  get allWords(){
    return this.words
  }

  lookup(query){
    var attrs = Object.keys(query)

    var matches = this.words.filter(word => {
      return attrs.every(key => {

        var pattern = query[key]
        if(pattern instanceof RegExp) {
          return word[key].match(pattern)
        } else {
          return  pattern == word[key]
        }

      })
    })

    var found = matches.length == 1 ? matches[0] : matches

    return found
  }

  unknown(word){
    return this.lookup(word).length == 0
  }

  add(submission){
    if(Word.isValidWord(submission) && this.unknown(submission) ){
      this.words.push(submission)
    }
  }

  addText(text){
    text.words.forEach(word => {
      this.add(word)
    })
  }

  generateMinimalPairs(maxDifference=1){
    /*
    {
      "house" : {
        "1": ["louse", "houses", "mouse"],
        "2": ["use", "unhouse", "whose", "those"]
        "3": ["housing", "housetop", "hovel"]
      }
    }
    */
    return this.allWords.reduce((comparisons, left, i, words) => {
      comparisons[left] = {}
      words.slice(i + 1, words.length).map(right => {

        comparisons[left][levenshtein(left, right)].push(right)
      })
      return comparisons
    }, {})

  }

  findMinimalPairs(word){
    if(!this.minimalPairs){
      this.minimalPairs = this.generateMinimalPairs()
    }
  }
}

