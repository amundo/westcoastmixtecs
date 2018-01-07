class Word {
 // comment
  constructor(data){
    this.form = data.form || null;
    this.gloss = data.gloss || null;
    if(data.examples){ this.examples = data.examples }
    Object.assign(this, data);
    //this.language = data.language || null;
  }

  get isGlossed(){
    return this.gloss ? true : false
  }

  static isValidWord(word){
    return 'gloss' in word && 'form' in word
  }

  distance(rules){
  }

  same(other){
    return Object.keys(this)
      .every(key => other[key] == this[key])
  }

  posTag(rules){
    rules.forEach(rule => {
      var pattern = rule[0], wordClass = rule[1];
      var plain = this.form.replace(/-/g, '');
      if(plain.match(new RegExp(pattern))){
        this.wordClass = wordClass;
      }
    })
  }

  phonemize(orthography='ipa'){
    var phonemes = this.language.phonemize(this.form, orthography);
    return phonemes.map(phoneme => this.language.transliterate('ipa', orthography, phoneme))
  }
}
