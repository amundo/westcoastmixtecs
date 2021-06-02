'use strict';

// DLx - Digital Linguistics
/*

2016-05-28 - lexicon returns object for one-word match 
2016-05-21 - major pruning
2016-05-17 - unify constructor signatures.  
2016-03-15 - add skeleton Segmenter
2016-03-07 - add Phrases#stitch

*/

class View {
  constructor(params){
    if('el' in params){ 
      if(typeof params.el === 'string'){
        this.el = document.querySelector(params.el);
      } else if (params.el.nodeType && params.el.nodeType === 1) { 
        this.el = params.el;
      }
    } else { 
      this.el = document.createElement('div'); 
    }

    if('model' in params){ 
      this.model = params.model 
    }

    if('collection' in params){ 
      this.collection = params.collection 
    }

    if('template' in params){ 
      this.template = params.template 
    }
 
  }

  render(){
    this.el.innerHTML = 'rendered';
    return this;
  }
}

class Collection {
  constructor(models){
    this.models = [];
    models.forEach(item => this.add(item));
  }
 
  load(url){
    fetch(url)
      .then(response => response.json())
      .then(json => { this.models = json.models; this.metadata = json.metadata })
      .catch(e => console.log(e))
  }

  at(n){
    return this.models[n]
  }

  sortBy(key){
    this.models.sort((a,b) => { 
      return a[key] > b[key] ? 1 : -1 
    })
  }

  add(item){
    this.models.push(item);
  }

  get length(){
    return this.models.length
  }

  search(query){
    var attrs = Object.keys(query);
    
    return this.models.filter(function(item){
      return attrs.every(function(key){

        var pattern = query[key];
        if(pattern instanceof RegExp) { 
          return  item[key].match(pattern);
        } else { 
          return  pattern == item[key];
        }

      })
    })
  }
}

class Phonology extends Collection {
  constructor(phones, metadata){
    super(phones);
    this.metadata = metadata || {};
  }
  
  get phones(){
    return this.data;
  }

  set phones(data){
    return data;
  }

  lookup(query){
    return where(this.ipa.phones, query)
  }
}

/* difference between this and Phonology?? */
class Inventory extends Collection { 
  constructor(phonemes){
    super(phonemes)
  } 

  get phonemes(){
    return this.data 
  }

}

class Transliterator {
  constructor(alphabet, metadata={}){
    this.alphabet = alphabet;
    this.metadata = metadata;
    this.orthographies = Object.keys(this.alphabet[0]);
  }

}

class Language {
  constructor(data={}){
    this.metadata = data.metadata;

    this.alphabet = data.alphabet || [];
    this.inventory = data.inventory || [];
    this.punctuation = data.punctuation || '!.?,:'.split('');
  }

  static isLanguage(language){
    return 'alphabet'  in language && Array.isArray(language.alphabet)  &&
           'inventory' in language && Array.isArray(language.inventory)
  }

  escape(unescaped){ // do we really need this?
    return unescaped.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  }

  phonemize(text, orthography='ipa'){
    var phonemes = this.alphabet.map(phoneme => phoneme[orthography]);
    phonemes.sort((a,b) => (a.length < b.length) ? 1 : -1);

    phonemes = phonemes.map(phoneme => this.escape(phoneme));

    var pattern = `(${phonemes.join('|')})`;
    var splitter = new RegExp(pattern, 'g');
  
    return text.split(splitter).filter(x => x); 
  }

  transliterate(from, to, text){
    var substitutions = {};

    this.alphabet.forEach(letter => {
      substitutions[letter[from]] = letter[to];
    })
  
    var phonemeList = this.phonemize(text, from);

    return phonemeList.map(phoneme => {
      return substitutions[phoneme] ? substitutions[phoneme] : phoneme;
    }).join('');
  }

  depunctuate(text, punctuation=this.punctuation){
    var re = new RegExp(`[${punctuation}]`, 'g');
    return text.replace(re, ' ');
  }

  tokenize(text){
    text = this.depunctuate(text);
    return text 
      .toLowerCase()
      .trim()
      .replace(/[ \.\?,\!]+/g, ' ') 
      .split(/[ ]+/g)
      .filter(token => token)
  }

  load(file){
    fetch(file)
      .then(response => response.json())
      .then(json => { 
         var 
           data = { alphabet: json.alphabet },
           metadata = json.metadata;
         this.initialize(data, metadata);
      })
      .catch(e => console.log(e))
  }

}


class Word { 
  constructor(data){
    this.token = data.token || null;
    this.gloss = data.gloss || null;
    this.language = data.language || null;
  }

  static isWord(){
    
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
      var plain = this.token.replace(/-/g, '');
      if(plain.match(new RegExp(pattern))){
        this.wordClass = wordClass;
      }
    })
  }

  phonemize(orthography='ipa'){
    var phonemes = this.language.phonemize(this.token, orthography);
    return phonemes.map(phoneme => this.language.transliterate('ipa', orthography, phoneme))
  }
}

class Phrase {
  constructor(data={}){
    this.transcription = data.transcription || null;
    this.translation   = data.translation || null;
    this.words         = data.words || [];

    this.language      = data.language; // || new Language({});
    this.stop          = data.stop || null;
    this.start         = data.start || null;

    this.metadata      = data.metadata || {};
  }

  tokenize(){
    return this.language.tokenize(this.transcription)
  }

  lookupWords(lexicon){
    this.words = this.tokenize()
      .map(token => lexicon.lookup(token))
  }

  /*

     A utility method for “stitching together” string representations of tokens and glosses. 

     var phrase = new Phrase({transcription: "yo habl-o español", translation: "I speak Spanish"});
     phrase.stitch(phrase.tokenize(phrase.transcription.split), '1S speak-1S.PRES spanish');
     phrase.words // [ { token: "yo", gloss: "1S"}, { token: "habl-o", gloss: "speak-1S.PRES"} … ] 
     
   */ 
  stitch(tokens, glosses){
    if(tokens.length != glosses.length) { throw new Error(`different gloss/token length: ${tokens.join(' ')}`) }
  
    this.words = tokens.map((token, i) => {
      return {token, gloss:glosses[i]};
    })
  
  }

}

class FormatParser {
  
  constructor(parser, plaintext){
    this.parser = parser;
    return this.parse(plaintext);
  }

  parse(plaintext){
    return this.parser(plaintext)
  }

}

var parseMonolingual = text => {
  return text
    .trim()
    .split(/\n\n/g)
    .map(p => p.split(/\n/g).map(String.trim))
    .map(pair => {
      return {
        transcription: pair[0], 
        translation: pair[1]
      }
    }) 
}

var parseBilingual = text => {
  return text
    .trim()
    .split(/\n\n/g)
    .map(p => p.split(/\n/g).map(String.trim))
    .map(p => {
      return {
        transcription: pair[0], 
        translation: pair[1]
      }
    }) 
}

class Text {
  static isText(instance){
    return [
      'phrases', 
      'metadata'
    ].every(property => instance[property] != null )
  }

  constructor(data){
    this.phrases = data.phrases || [];
    this.metadata = data.metadata || {};
  }

  get allWords(){
    return this.phrases.reduce((words, phrase) => {
       words = words.concat(phrase.words);
       return words;
    }, [])
  }

}

class WordView {
  constructor(word){
    this.word = word; 
  }

  template(){
    return `
        ${(this.word.start && this.word.stop) ?  `<date>${this.word.start}-${this.word.stop}</date>` : ''}
        <p class=token><strong>${this.word.token}</strong></p>
        <p class=gloss>${this.word.gloss ? this.word.gloss : `<input class=gloss>`}</p>
    `
  }

  render(){
    return `
      <div class=word>
        ${this.template()}
      </div>
    `
  }
}

class PhraseView {
  constructor(data){
    this.phrase = data.phrase; 
    this.el =  data.el || document.createElement('div'); 
    this.el.classList.add('phrase');
  }

  template(){
    this.el.innerHTML = `
        ${(this.phrase.start && this.phrase.stop) ?  `<date>${this.phrase.start.toFixed(3)}-${this.phrase.stop.toFixed(3)}</date>` : ''}
        <p class=transcription><strong>${this.phrase.transcription}</strong></p>
        ${(this.phrase.words) ?  `<div class=words>${this.phrase.words.map(w => new WordView(w).render()).join('\n')}</div>` : '<div class=word></div>'}
        <p class=translation>${this.phrase.translation}</p>
    `
  }

  render(){
    this.template();
    return this.el;
  }
}

class TextView {
  constructor(data){
    this.text = data.text; 
    this.el = data.el || document.createElement('section'); 
    this.el.classList.add('text');
    this.PhraseView = data.PhraseView || PhraseView; 
    this.el.classList.add('text');
  }

  render(){
    this.phraseViews = this.text.phrases
      .map(phrase => {
        return new this.PhraseView({phrase})
      })

    this.phraseViews.forEach(pv => {
        var node = pv.render();
console.log(node);
        this.el.appendChild(node)
      })

  tv.phraseViews.forEach(pv => pv.render())

    return this.el;
  }
}

class ParallelTextView {
  constructor(text){
    this.text = text; 
  }

  render(){
    return `
      <section class=text>
      ${this.text.phrases.map(phrase => `
        <div class=transcription>
          <p><strong>${phrase.transcription}</strong></p>
        </div>
      `).join('\n')}
      ${this.text.phrases.map(phrase => `
        <div class=translation>
          <p>${phrase.translation}</p>
        </div>
      `).join('\n')}
      </section>
    `
  }
}

class Corpus {
  constructor(data){
    this.texts = data.texts || [];
    this.metadata = data.metadata = {};
  }

  load(urls){
    if(typeof urls === 'string') urls = [urls];

    var promises = urls.map((url,i) => {
      return fetch(url)
        .then(response => response.json())
    })

    // Promise.all(promises)
    //  .then(fetched => fetched.forEach(text => {
    //    this.texts.push(new Text(text))
    //    return this.texts;
    // })
  }

  save(){
    // Open a database.
    var db;
    var request = window.indexedDB.open(this.saveAs);

    request.onerror = function(event) {
      console.log("Database error: " + event.target.errorCode);
    };

    request.onsuccess = function(event) {
      db = event.target.result;
    };

    request.onupgradeneeded = function(event) { 
      var db = event.target.result;
    
      // Create an objectStore for this database
      var objectStore = db.createObjectStore(`${this.saveAs}-corpus`, { keyPath: this.saveAs });
    };

    // Create an object store in the database. 
    // Start a transaction and make a request to do some database operation, like adding or retrieving data.
    // Wait for the operation to complete by listening to the right kind of DOM event.
    // Do something with the results (which can be found on the request object).

  }

/*
  set texts(_texts){
    return _texts.map(text => {
      if(text instanceof Text) { 
        return text
      } else { 
        return new Text(text)
      } 
    })
  }
*/

  add(text){
    this.texts.push(text)
  }

  get allWords(){
    return this.texts.reduce((words, text) => {
      words = text.allWords.concat(text.words);
      return words;
    }, [])
  }

}

class Lexicon {
  constructor(data){
    this.words = data.words.map(word => new Word(word));
    this.metadata = data.metadata;

    this.sort();
  }

  at(n){
    return this.words[n]
  }

  sort(){
    this.words.sort((a,b) => { 
      return a.token > b.token ? 1 : -1 
    })
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
    var attrs = Object.keys(query);
    
    var matches = this.words.filter(function(word){
      return attrs.every(function(key){

        var pattern = query[key];
        if(pattern instanceof RegExp) { 
          return  word[key].match(pattern);
        } else { 
          return  pattern == word[key];
        }

      })
    })
  
    var found = matches.length == 1 ? matches[0] : matches;

    return found;
  }

  add(word){
    if(!this.lookup(word).length){
      this.words.push(word);
    }
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
      comparisons[left] = {};
      words.slice(i + 1, words.length).map(right => {
         
        comparisons[left][levenshtein(left, right)].push(right)
      })
      return comparisons
    }, {})

  }

  findMinimalPairs(word){
    if(!this.minimalPairs){
      this.minimalPairs = this.generateMinimalPairs();
    }
  }
}

class LexiconView {
  constructor(lexicon, el){
    this.lexicon = lexicon; 
    this.template = this.template; 
    this.el = el;
  }

  template(){
    return `
      <dl class=lexicon>
      ${this.lexicon.words.map(word => `
        <dt>${word.token}</dt>
        <dd>${word.gloss || ''}</dd>
      `).join('\n')}
      </dl>
    `
  }

  render(){
    if(this.el)
    return this.template()
  }
}


