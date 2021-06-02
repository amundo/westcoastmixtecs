// new: accepts an optional transformer as first argument
// str.template({key:value});
// or
// str.template(htmlEscaper, {key:value});
String.prototype.template = function (fn, object) {
  // Andrea Giammarchi - WTFPL License
  var
    hasTransformer = typeof fn === 'function',
    prefix = hasTransformer ? '__tpl' + (+new Date) : '',
    stringify = JSON.stringify,
    re = /\$\{([\S\s]*?)\}/g,
    evaluate = [],
    i = 0,
    m
  ;

  while (m = re.exec(this)) {
    evaluate.push(
      stringify(this.slice(i, re.lastIndex - m[0].length)),
      prefix + '(' + m[1] + ')'
    );
    i = re.lastIndex;
  }
  evaluate.push(stringify(this.slice(i)));
  // Function is needed to opt out from possible "use strict" directive
  return Function(prefix, 'with(this)return ' + evaluate.join('+')).call(
    hasTransformer ? object : fn, // the object to use inside the with
    hasTransformer && fn          // the optional transformer function to use
  );
};
