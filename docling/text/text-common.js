let parseRange = range => range.split(',')
  .map(x => x.trim())
  .reduce((numbers, range) => {
    if(range.includes('-')){
      let [start, end] = range
        .split('-')
        .map(digit => parseInt(digit))
      range = Array.from(Array(end - start + 1).keys())
          .map(i => start + i)
      numbers.push(range)
    } else {
      numbers.push(parseInt(range))
    }

    return numbers
  }, [])
  .flat(2)


export {parseRange}

