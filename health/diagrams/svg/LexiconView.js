
class LexiconView {
  constructor(lexicon=new Lexicon, el=document.createElement('div')){
    this.lexicon = lexicon;
    this.el = el 
  }

  render(){
    this.el.innerHTML = `
      <ol class=lexicon>
      ${this.lexicon.words.map(word => `
        <li class=word>
          <strong class=form>${word.form}</strong>
          <span class=gloss>${word.gloss || ''}</span>
          <div class=examples>
          </div>
        </li>
      `).join('\n')}
      </ol>
    `
    return this.el
  }
}
