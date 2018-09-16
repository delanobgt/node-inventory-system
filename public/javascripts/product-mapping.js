let ProductMapping = (function () {
  let mappings = {
    'MESRAN MIN 10W SE/CC DR 209L': 'MESRAN 10W @209L'
  }

  return {
    map: (name) => {
      return mappings[name] || name
    }
  }
})()