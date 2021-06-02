\<sentence-editor\> component documentation
===========================================

Component for editing `Sentence` objects. Manages interlinearization of
a transcription by providing a dynamically-updated list of
\<word-editor\>s for glossing tokens.

Tokenization can be customized by referencing a `Language`.

HTML
----

::: {.section .usage}
### Usage

#### Basic sentence-editor

```{=html}
<sentence-editor>
</sentence-editor>
```

#### Editing an existing sentence

```{=html}
<sentence-editor 
  transcription="mi casa su casa"
  translation="My home is your home.">
</sentence-editor>
```
      
:::

::: {.section .example}
### Example
:::

Javascript
----------

::: {.section .properties}
### Properties

#### get data()

Returns the component's `sentence` data as an object.

#### set data(sentence)

Set the sentence's data.
:::

::: {.section .attributes}
### Attributes
:::

::: {.section .Events}
### Events
:::
