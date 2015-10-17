# ![Skid](http://jaydenseric.com/shared/skid-logo.svg)

Skid is an ultra-lightweight slider supporting mouse and touch written in plain JS. It leverages [Hurdler](https://github.com/jaydenseric/Hurdler) for control via URL hashes.

Try the [demo](http://rawgit.com/jaydenseric/Skid/master/demo.html).

## Dependancies

[Hurdler](https://github.com/jaydenseric/Hurdler), for control via URL hashes.

## Browser support

[Evergreen browsers](http://stackoverflow.com/a/19060334) and IE 9+.

Be sure to use the [DOM4 polyfill](https://github.com/WebReflection/dom4) or manually handle:

- [`query`](https://dom.spec.whatwg.org/#dom-elements-query)
- [`classList`](https://dom.spec.whatwg.org/#dom-element-classlist)
- [`CustomEvent`](https://dom.spec.whatwg.org/#interface-customevent)
- [`requestAnimationFrame`](https://html.spec.whatwg.org/multipage/webappapis.html#dom-window-requestanimationframe)
- [`cancelAnimationFrame`](https://html.spec.whatwg.org/multipage/webappapis.html#dom-window-cancelanimationframe)

## Usage

### Setup

1. Add [*hurdler.js*](https://github.com/jaydenseric/Hurdler/blob/master/hurdler.js) and [required polyfills](https://github.com/jaydenseric/Hurdler#browser-support).
2. Add [*skid.js*](https://github.com/jaydenseric/Skid/blob/master/skid.js) and [required polyfills](https://github.com/jaydenseric/Skid#browser-support).
3. Add [*skid.css*](https://github.com/jaydenseric/Skid/blob/master/skid.css).
4. Add slider markup as per [*demo.html*](https://github.com/jaydenseric/Skid/blob/master/demo.html). Make sure there are no spaces or line breaks between slide elements to avoid whitespace issues.
5. Follow the example JS in [*demo.html*](https://github.com/jaydenseric/Skid/blob/master/demo.html) for how to initialize Skid and run Hurdler.

### Constructor

`new Skid.Slider(options)` constructs a new Skid Slider instance.

Parameter           | Type                       | Default        | Description
--------------------|----------------------------|----------------|--------------------------------
`options.element`   | HTMLElement                |                | Container.
`options.slides`    | HTMLElement                | `> .slides`    | Slides container.
`options.priorLink` | HTMLElement &#124; boolean | `> nav .prior` | Prior slide link or `false`.
`options.nextLink`  | HTMLElement &#124; boolean | `> nav .next`  | Next slide link or `false`.
`options.tabs`      | HTMLElement &#124; boolean | `> nav ol`     | Tab links container or `false`.

### Activate slide

Use `slider.activateSlide(slide)` to activate and pan to a slide, with `slide` being the element or ID of the slide to activate.

### Events

Events can be listed for using `addEventListener`.

Element | Event       | Description
--------|-------------|------------------------------------------
Slider  | `activated` | A slide in the slider has been activated.
Slide   | `active`    | The slide is now active.
