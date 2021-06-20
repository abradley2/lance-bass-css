const postcss = require('postcss')
const fs = require('fs')

const plugin = require('./')

let _exit = false
const exit = () => _exit = true

const bassCssPlugins =  [
  require('postcss-import'),
  require('postcss-custom-media'),
  require('postcss-custom-properties', {
    preserve: true
  }),
  require('postcss-calc'),
  require('cssstats'),
  require('postcss-discard-comments'),
  require('autoprefixer'),
  require('postcss-reporter')
]

async function run (input, output, opts = { }) {
  let result = await postcss(bassCssPlugins.concat([plugin(opts)])).process(input, { from: 'basscss/src/basscss.css' })
  fs.writeFile('dist.css', result.css, () => true)
}


fs.readFile('basscss/src/basscss.css', 'utf8', (err, data) => {
  run(data)
})


;(function runProcess () {
  setTimeout(() => {
    if (_exit === false) {
      runProcess()
    }
  }, 10)
})
