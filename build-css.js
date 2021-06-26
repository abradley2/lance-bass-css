const postcss = require('postcss')
const fs = require('fs')

const plugin = getPlugin().exports

const bassCssPlugins = [
  require('postcss-import'),
  require('postcss-custom-media'),
  require('postcss-custom-properties')({
    preserve: true
  }),
  require('postcss-calc'),
  require('cssstats'),
  require('postcss-discard-comments'),
  require('autoprefixer'),
  require('postcss-reporter')
]

const properties = {}
const selectors = {}

async function run (input) {
  const result = await postcss(bassCssPlugins.concat([plugin()])).process(input, { from: 'basscss/src/basscss.css' })
  fs.writeFile('util.css', result.css, () => true)
}

fs.readFile('basscss/src/basscss.css', 'utf8', function (err, data) {
  if (err != null) {
    console.error(err)
    process.exit(1)
  }

  run(data).then(() => {
    const dataJSON = JSON.stringify({ properties, selectors }, null, 2)

    fs.writeFile('docs/css-data.json', dataJSON, {
      encoding: 'utf8'
    }, function (err) {
      if (err != null) {
        console.error(err)
        process.exit(1)
      }
    })
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
})

function getPlugin () {
  const mod = {}
  mod.exports = (opts = { }) => {
    return {
      postcssPlugin: 'postcss-lance-bass',
      Declaration: function (decl, postcss) {
        const parent = decl.parent

        if (decl.value.includes('var(')) return

        if (!properties[decl.prop]) properties[decl.prop] = []

        properties[decl.prop].push([parent.selector, decl.value])

        if (!selectors[parent.selector]) selectors[parent.selector] = []
        selectors[parent.selector].push([decl.prop, decl.value])
      }
    }
  }
  mod.exports.postcss = true
  return mod
}
