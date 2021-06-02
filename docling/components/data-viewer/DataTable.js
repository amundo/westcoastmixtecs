export class DataTable extends HTMLTableElement {

  constructor(){
    super()

    this.listen()
  }

  connectedCallback(){ 
    if(this.querySelector('td')){
      this.read() 
    } else if(this.querySelector('pre')){
      this.parse()  
    } else {
      this.reset()
    }
  }

  reset(){ 
    this.innerHTML = `<thead>
    </thead>
    <tbody>
    </tbody>
    `
  }

  attributeChangedCallback(attribute, oldValue, newValue){ console.log(`hi`)
    if(attribute == 'src'){ 
      fetch(newValue)
        .then(r => r.json())
        .then(data => {this.data = data})
        .catch(e => console.error(e))
    }
  }

  parse(){
    let pre = this.querySelector('pre')
    pre.remove()

    let data = JSON.parse(pre.textContent)
    this.data = data

    this.reset()

  }

  matrixToCollection(matrix){
    let keys = matrix.shift()
    return matrix.map(row => 
      Object.fromEntries(row.map((value,i) => [keys[i], value]))
    )
  }

  read(){
    if(this.querySelector('input')){
      this.save()
    }

    let matrix = [...this.rows]
      .map(row => [...row.cells].map(cell => cell.textContent))
      
    return this.matrixToCollection(matrix)
  }
  
  save(){
    this.querySelectorAll('td > input')
      .forEach(input => input.parentElement.textContent = input.value)
  }

  render(items=null){
    if(!items){
      items = this.read()
    }

    this.reset()

    this.querySelector('thead').innerHTML = `<tr></tr>`

    let headers = Object.keys(items[0])

    headers.forEach(header => {
      let th = document.createElement('th')
      th.textContent = header
      this.querySelector('thead tr').append(th)
    })

    items.forEach(item => {

      let tr = document.createElement('tr')
      
      headers.forEach(header => {
        let td = document.createElement('td')
        td.textContent = item[header]
        
        tr.append(td)
      })
    
      this.querySelector('tbody').append(tr)
    })
  }


  edit(){
    this.querySelectorAll('td').forEach(td => {
      td.innerHTML = `<input value="${td.textContent}">`
    })
  }

  editEmpty(){
    [...this.querySelectorAll('td')]
    .filter(td => !td.textContent.trim())
    .forEach(td => 
      td.innerHTML = `<input value="${td.textContent}">`
    )
  }

  editColumn(columnName){

  }

  addRow(){

  }

  set data(data){
    this.render(data)
  }

  get data(){
    return this.read()
  }

  set matrix(matrix){
    return 
  }

  get matrix(){
    return 
  }

  set headers(headers){
    return 
  }

  addColumn(columnName){
    this.data.forEach(item => item[columnName] = '')
    this.render()
  }

  listen(){
    this.addEventListener("dblclick", dblclickEvent => {
      if(
        dblclickEvent.target.matches('td') &&
        !dblclickEvent.target.matches('input')
      ){
        let td = dblclickEvent.target
        td.innerHTML = `<input value="${td.textContent}">`
      }
    })

    this.addEventListener("keyup", keyupEvent => {
      if(keyupEvent.target.matches('input') &&
        keyupEvent.key == 'Enter'
      ){
        this.save()
      }
    })
  }
}

customElements.define('data-table', DataTable, {extends: 'table'})



