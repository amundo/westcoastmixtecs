const dirTree = require("directory-tree")
let fs = require('fs')

let renderHTML = item => {
  // console.log(item)
  if((item.children)){

    details = `<details open id="${item.name}-folder" class=file-tree><summary>${item.name}</summary>\n`

    item.children
      .forEach(child => {
        details += renderHTML(child)
      })

    details += '</details>\n'

    return details
  } else { 
    let path = item.path.replace('/Users/pat/Sites/book/docling/', './')
    return `<p  id="${item.name}-file" data-filetype="${item.name.split('.').pop()}">
      <a target=_blank href="${path}">${item.name}</a>
    </p>`
  }
}



let style = `
<style>
details.file-tree { margin-left: 2em; }
details.file-tree:hover {cursor: pointer;}
details.file-tree p { margin-left: 2em; margin: 0 2em; }
details.file-tree, details.file-tree summary { line-height: 1.5; }

details.file-tree summary:before { content: "📁 " }
details.file-tree p[data-filetype="webm"]:before {content: "📹"}
details.file-tree p[data-filetype="txt"]:before  {content: "📄"}
details.file-tree p[data-filetype="html"]:before {content: "🔗"}
details.file-tree p[data-filetype="json"]:before {content: "💾"}
details.file-tree p[data-filetype="wav"]:before  {content: "🎙️"}
details.file-tree p[data-filetype="mp3"]:before  {content: "🎙️"}
details.file-tree p[data-filetype="js"]:before   {content: "🤖"}
details.file-tree p:before { content: "📄 " }
</style>
`


let tree = dirTree('/Users/pat/Sites/book/docling/',
{ exclude: /git|dirtree.js|template.html|\.DS_Store|originals|emeld|docx|.md$|\.pdf|\.sh|feedback|plan|images|\.vscode|wtf|\.css\/*\.md|.*\.png|diagrams|howtos|secret|outline.*|todo\.md/}
)

//{exclude: /outline.*|*.sh|diagrams|dirtree\.js|documentation-template.*|docx.*|emeld|feedback|howtos|tag-history.*|template\.html|todo\.md/}


let sortByTypeAndName = children => {
  let order = ['file', 'directory']

  children.sort((a,b) => {

    if(order.indexOf(a.type)  < order.indexOf(b.type)){
      return -1
    } else {
      if(a.name.toLowerCase() < b.name.toLowerCase()){
        return 1
      } else {
        return -1
      }
    }
  })

  return children
}

let sortTree = tree => {
  if(tree.children){
    tree.children.forEach(child => {
      child.path = child.path.replace('/Users/pat/Sites/book/docling/', './')
    })
		tree.children = tree.children.map(sortTree)
	  tree.children = sortByTypeAndName(tree.children)
  }
  return tree
} 

tree = sortTree(tree)

// renderHTML(tree)
fs.writeFileSync('docling-index.json', JSON.stringify(tree,null,2))

