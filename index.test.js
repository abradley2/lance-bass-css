const postcss = require('postcss')

const plugin = require('./')

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
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

/* Write tests here

it('does something', async () => {
  await run('a{ }', 'a{ }', { })
})

*/
