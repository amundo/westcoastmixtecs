

var json2table = (data, columns) => {
  var table = document.createElement('table');
  
  var headers = columns || Object.keys(data[0]);
  var thead = `<thead><tr><th>${headers.join('</th><th>')}</th></tr></thead>`;
  table.insertAdjacentHTML('afterbegin', thead);
  var tbody = table.appendChild(document.createElement('tbody'));
  
  data.forEach(d => {
    var tr = document.createElement('tr');
    headers.forEach(header => {
      var td = document.createElement('td');
      td.textContent = d[header];
      tr.appendChild(td)
    })
    tbody.appendChild(tr);
  });
  
  return table;

}



