module.exports = (opts = { }) => {

  // Work with options here

  return {
    postcssPlugin: 'postcss-lance-bass',
    /*
    Root (root, postcss) {
      // Transform CSS AST here
    }
    */


    Declaration (decl, postcss) {
      // The faster way to find Declaration node
      const parent = decl.parent
      console.log(`${parent.selector} : ${decl.prop} -> ${decl.value}`)
    }


    /*
    Declaration: {
      color: (decl, postcss) {
        // The fastest way find Declaration node if you know property name
      }
    }
    */
  }
}
module.exports.postcss = true
