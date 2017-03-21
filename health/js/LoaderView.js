class LoaderView {
  constructor({el}){
    this.el = el;
    this.fileInput = el.querySelector('input[type="file"]');
    this.urlInput = el.querySelector('input[type="url"]');

    this.data = null;

    this.listen();
  }

  get help(){
    return `
A LoaderView provides a default interface for 
loading JSON data in one of two ways:

1. Via a traditional <input type=file>
2. Via a fetch call to a URL passed in in a <input type=url>

The instance has a .data property which will be
populated with the (untyped) data object once
either of the two preceding methods is executed
by the user.

It is assumed that this.el is in the DOM when 
the LoaderView is instantiated, and that it contains 
one each of an <input type="file"> and an <input type="url">.
`
  }

  loadViaFileInput(ev){
    let fileReference = ev.target.files[0];
    
    var reader = new FileReader();
    reader.addEventListener('load', loadEvent => {
      this.data = JSON.parse(loadEvent.target.result);
    });
    reader.readAsText(fileReference);
  }

  loadViaFetch(keyupEvent){
    if(keyupEvent.which == 13){
      let url = keyupEvent.target.value.trim();
      fetch(url)
        .then(response => response.json() )
        .then(data => this.data = data)
    }
  }

  listen(){
    this.fileInput.addEventListener('change', changeEvent => this.loadViaFileInput(changeEvent));
    this.urlInput.addEventListener('keyup', keyupEvent => this.loadViaFetch(keyupEvent));
  }
}

 
