let XLSParser = (function () {
  let oFileIn
  let onParsedCb = () => {}

  $(function () {
    oFileIn = document.getElementById('file-excel')
    if (oFileIn.addEventListener) {
      oFileIn.addEventListener('change', filePicked, false)
    }
  })

  function filePicked(oEvent) {
    // Get The File From The Input
    let oFile = oEvent.target.files[0]
    let sFilename = oFile.name
    // Create A File Reader HTML5
    let reader = new FileReader()

    // Ready The Event For When A File Gets Selected
    reader.onload = function (e) {
      let data = e.target.result
      try {
        let cfb = XLS.CFB.read(data, {
          type: 'binary'
        })
        let wb = XLS.parse_xlscfb(cfb)
        let oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[wb.SheetNames[0]], { header: 1 })
        $('.file-name').text(`Filename: ${sFilename}`)
        onParsedCb(oJS)
      } catch (err) {
        console.log(err)
        UIkit.notification.closeAll()
        UIkit.notification('<span uk-icon="icon: ban"></span> Only *.xls files are allowed!')
      }
    }

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile)
  }

  return {
    onParsed: function(cb) { onParsedCb = cb }
  }
})()
