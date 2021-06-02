import {DataViewer} from '../data-viewer/DataViewer.js'

export class IPADiacriticTable extends HTMLElement {
  static get observedAttributes(){
    return []
  }

  constructor(){
    super()
    this.dataViewer = new DataViewer()
    this.dataViewer.setAttribute("root", "diacritics")
    this.dataViewer.setAttribute("headers", "display description examples")
    this.dataViewer.setAttribute("src", "../data/phonetics/ipa/ipa-diacritics.json")
    this.append(this.dataViewer)
  }

  get data(){
    return this.querySelector('data-viewer').data
  }
}

customElements.define('ipa-diacritic-table', IPADiacriticTable)