---
pagetitle: data-viewer
snake: data-viewer
camel: DataViewer
---

## example

here: 

```{=html}
<figure>
  <figcaption>&lt;data-viewer> example</figcaption>
  <pre></pre>
  <data-viewer src="sample-data.json"></data-viewer>
</figure>
```

Inline JSON:

```{=html}
<figure>
  <figcaption>&lt;data-viewer> example</figcaption>
  <pre></pre>
  <data-viewer>[{"a": 1}, {"a": 10}]</data-viewer>
</figure>
```



<script type=module>
import {DataViewer} from './DataViewer.js'

document.querySelectorAll('data-viewer').forEach(component => {
  component.addEventListener('loaded', loadedEvent => {
    let pre = component.parentElement.querySelector('pre')
    pre.textContent = component.outerHTML
  })
})

</script>

* working example
* HTML example

## styling

* format gallery
* colors

## data

* import
* export

## programmability

* properties
* events
* methods

## accessibility