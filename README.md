# @aziis98/gdsl

[![JSR](https://jsr.io/badges/@aziis98/gdsl)](https://jsr.io/@aziis98/gdsl)

**G**raphics **DSL** is a small library to help write canvas drawing code in a
more declarative style.

The main function of this library is `render2d(g, dsl)`

-   The first argument is the `CanvasRenderingContext2D` to draw to.

-   The second one is a structure must be one of the following:

    -   An array, this recursively calls `render2d` on every primitive inside
        the array, automatically scoping the call with `save`/`restore`.

    -   An object, this is useful for passing multiple options all in one like
        `strokeStyle`, `lineWidth`, ... This can also be used to easily create
        custom _compund_ styles

        ```js
        const LINE_STYLE_1 = {
            strokeStyle: 'royalblue',
            lineWidth: 1,
        }

        const LINE_STYLE_2 = {
            ...LINE_STYLE_1,
            lineWidth: 5,
        }
        ```

    -   A function, this is how primitives are implemented. This simply gets
        called with the `g` passed as input. To create new primitives one can
        use [function currying](https://en.wikipedia.org/wiki/Currying) like the
        [circle function](#file-gdsl-js-L43-L45)

        ```js
        export const circle = (x, y, r) => g => {
            g.arc(x, y, r, 0, Math.PI * 2)
        }
        ```

This idea is mostly borrowed from the Mathematica
[`Graphics`](https://reference.wolfram.com/language/ref/Graphics.html) function

## Example: Live Interactive Graph

<p align="center">
<img alt="interactive graph screenshot" src="https://github.com/aziis98/gdsl/assets/5204494/949eebed-d4da-4cec-97a0-aa4df25c5cb8" />
</p>

In this example I show how one can create a pretty decent live interactive graph
just using `render2d` (and some utility functions like `rescale`)
