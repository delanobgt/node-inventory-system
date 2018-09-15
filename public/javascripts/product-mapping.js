let ProductMapping = (function () {
  let mappings = {
    'A': 'A'
  }

  return {
    map: (name) => {
      return mappings[name] || name
    }
  }
})()