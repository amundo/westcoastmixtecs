class Lexicon {
  constructor(){
    this.metadata = {}
    this.words = []
  }

  same(a,b){
    return a.form == b.form && a.gloss == b.gloss
  }

  has(query){
    return this.words.some(word => this.same(word,query))
  }

  add(words){
    if(!Array.isArray(words)){
      let word = words
      words = [word]
    }

    words.forEach(word => {
      if(!this.has(word)){
        this.words.push(word)
      }
    })
  }

  remove(bads){
    if(!Array.isArray(bads)){
      let bad = bads
      bads = [bad]
    }

    this.words = this.words.filter(word => 
      !bads.some(bad => this.same(bad, word))
    )
  }
}

export {Lexicon}