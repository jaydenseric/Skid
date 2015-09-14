# ![Skid](http://jaydenseric.com/shared/skid-logo.svg)

Skid is an ultra-lightweight slider written in plain JS.

It leverages [Hurdler](https://github.com/jaydenseric/Hurdler) for semantic hash link controls and the ability to link to particular slides.

Try the [demo](http://rawgit.com/jaydenseric/Skid/master/demo.html).

## Dependancies

[Hurdler](https://github.com/jaydenseric/Hurdler), for controlling Skid via URL hashes.

## Browser support

Evergreen browsers for now; IE9 should work but hasn't been tested.

Be sure to use the [DOM4 polyfill](https://github.com/WebReflection/dom4) or manually handle:

- [Elements.query](https://dom.spec.whatwg.org/#dom-elements-query)
- [Element.classList](https://dom.spec.whatwg.org/#dom-element-classlist)

## Usage

1. Add [*hurdler.js*](https://github.com/jaydenseric/Hurdler/blob/master/hurdler.js) and [required polyfills](https://github.com/jaydenseric/Hurdler#browser-support).
2. Add [*skid.js*](https://github.com/jaydenseric/Skid/blob/master/skid.js) and [required polyfills](https://github.com/jaydenseric/Skid#browser-support).
3. Add [*skid.css*](https://github.com/jaydenseric/Skid/blob/master/skid.css).
4. Follow the example in [*demo.js*](https://github.com/jaydenseric/Skid/blob/master/demo.js) for how to initialize Hurdler and Skid.

### `new Skid(container)`

Constructs a new Skid instance.

Parameter | Type | Description
--- | --- | ---
container | HTMLElement | The element containing all components.

### `skid.activateSlide(slideId)`

Activates and pans to a slide.

Parameter | Type | Description
--- | --- | ---
slideId | string | HTML ID of the slide to activate.
