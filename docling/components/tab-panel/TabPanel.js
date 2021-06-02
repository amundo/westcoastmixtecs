export class TabPanel extends HTMLElement {
  constructor(){
    super()
  }

  connectedCallback(){
    this.panels = Array.from(this.children)
    this.render()
    this.listen()    
  }

  static get observedAttributes(){
    return ['labels']
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    let labels
    if(attribute == 'labels'){
      if(newValue.includes(',')){
        labels = newValue.split(/,/g).map(label => label.trim())
      } else {
        labels = newValue.split(/[ ]+/g).map(label => label.trim())
      }
      this.labels = labels
    }
  }

  render(){
    let nav = document.createElement('nav')
    nav.setAttribute('role', 'tablist')
    nav.setAttribute('aria-label', this.getAttribute('label')) // use once set?
  
    this.panels.forEach((panel,i) => {
      let panelId = `${this.id}-panel-${i+1}`
      let tabId = `${this.id}-tab-${i+1}`
      
      if(!panel.id){
        panel.id = panelId
      }

      let tab = document.createElement('button')

      tab.setAttribute('role', 'tab')
      tab.id = tabId
      tab.setAttribute('aria-controls', panelId)
      if(i === 0){
        tab.setAttribute('tabindex', '0')  
      } else {
        tab.setAttribute('tabindex', '-1')
      }

      if(this.labels){
        tab.textContent = this.labels[i]
      } else {
        tab.textContent = tabId
      }
  
      nav.append(tab)
  
      panel.setAttribute('aria-labelledby', panelId)
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('tabindex', 0)
      if(i > 0){
        panel.classList.add("tab-hidden")
      }
    })
  
    this.insertAdjacentElement('afterbegin', nav)
  }

  get tabs(){
    return this.querySelectorAll('[role="tab"]')
  }

  get tablist(){
    return this.querySelector('[role="tablist"]')
  }

  select(tab){
    this.tabs.forEach(tab => tab.setAttribute("aria-selected", false))
    tab.setAttribute('aria-selected', true)

    // Hide all tab panels
    this.panels.forEach(panel => 
      panel.classList.add('tab-hidden')
    )

    // Show the selected panel
    console.log(tab)
    let panelLabel = tab.getAttribute("aria-controls")
    let selector = `[aria-labelledby="${panelLabel}"]`

    let activePanel = this.querySelector(selector)
    activePanel.classList.remove('tab-hidden')
  }

  listen(){
    let changeTabs = clickEvent => { //TODO do we need this?
      this.select(clickEvent.target)
    }

    // Add a click event handler to each tab
    this.tabs.forEach(tab => tab.addEventListener("click", changeTabs))

    // Enable arrow navigation between tabs in the tab list
    let tabFocus = 0

    this.tablist.addEventListener("keydown", keydownEvent => {
      // Move right
      if (keydownEvent.key == 'ArrowRight' || keydownEvent.key == 'ArrowLeft') {
        this.tabs[tabFocus].setAttribute("tabindex", -1)
        
        if (keydownEvent.key == 'ArrowRight') {
          tabFocus++
          // If we're at the end, go to the start
          if (tabFocus >= this.tabs.length) {
            tabFocus = 0
          }
          // Move left
        } else if (keydownEvent.key == 'ArrowLeft') {
          tabFocus--
          // If we're at the start, move to the end
          if (tabFocus < 0) {
            tabFocus = this.tabs.length - 1
          }
        }

        this.tabs[tabFocus].setAttribute("tabindex", 0)
        this.tabs[tabFocus].focus()
      }
    })

  }
}

customElements.define('tab-panel', TabPanel)