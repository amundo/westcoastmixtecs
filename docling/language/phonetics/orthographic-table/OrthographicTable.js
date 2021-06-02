import {DataTable} from '../data-viewer/DataTable.js'

export class OrthographicTable extends DataTable {
  static get observedAttributes(){
    return ['orthographies']
  }

  constructor(){
    super()
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute=='orthopgraphies'){
      this.orthographies = newValue
    }
  }

  get orthographies(){
    return this.headers
  }

  set orthographies(orthographies){
    return this.headers = orthographies
  }
}

customElements.define('orthographic-table', OrthographicTable)

