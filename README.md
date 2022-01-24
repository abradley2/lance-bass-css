## Lance Basscss

Based on [Basscss](https://github.com/basscss/basscss). Allows you to easily customize the utility classes of the default Basscss, and generates a documentation site with each build (you can see a running example [here](https://basscss-tldr.surge.sh))


## Usage

1. Fork this repository, clone it, `rm -rf ./.git && git init`
2. `pnpm install && pnpm run build && pnpm run serve` will put the documentation site on `http://localhost:1234`

Edit Basscss in the contents of `/basscss/src` and run a fresh build with `pnpm run build` to update the documentation site.

The final output is contained in `util.css` for your own use. The initial `util.css` in this repository is simply the un-edited Basscss dist file.
