# ![Skid](http://jaydenseric.com/shared/skid-logo.svg)

Skid is an ultra-lightweight slider supporting mouse and touch written in plain JS. It leverages [Hurdler](https://github.com/jaydenseric/Hurdler) for URL hash link controls and the ability to link to particular slides.

Try the [demo](http://rawgit.com/jaydenseric/Skid/master/demo.html).

## Dependancies

[Hurdler](https://github.com/jaydenseric/Hurdler), for controlling Skid via URL hashes.

## Browser support

Evergreen browsers and IE9.

Be sure to use the [DOM4 polyfill](https://github.com/WebReflection/dom4) or manually handle:

- [Elements.query](https://dom.spec.whatwg.org/#dom-elements-query)
- [Element.classList](https://dom.spec.whatwg.org/#dom-element-classlist)
- [Window.requestAnimationFrame](https://html.spec.whatwg.org/multipage/webappapis.html#dom-window-requestanimationframe)
- [Window.cancelAnimationFrame](https://html.spec.whatwg.org/multipage/webappapis.html#dom-window-cancelanimationframe)

## Usage

1. Add [*hurdler.js*](https://github.com/jaydenseric/Hurdler/blob/master/hurdler.js) and [required polyfills](https://github.com/jaydenseric/Hurdler#browser-support).
2. Add [*skid.js*](https://github.com/jaydenseric/Skid/blob/master/skid.js) and [required polyfills](https://github.com/jaydenseric/Skid#browser-support).
3. Add [*skid.css*](https://github.com/jaydenseric/Skid/blob/master/skid.css).
4. Add slider markup as per [*demo.html*](https://github.com/jaydenseric/Skid/blob/master/demo.html). Make sure there are no spaces or line breaks between slide elements to avoid whitespace issues.
5. Follow the example JS in [*demo.html*](https://github.com/jaydenseric/Skid/blob/master/demo.html) for how to initialize Hurdler and Skid.

### Constructor

`var slider = new Skid.Slider(element)` constructs a new Skid Slider instance, with `element` being that which contains all components.

### Activate slide

Use `slider.activateSlide(id)` to activate and pan to a slide, with `id` being the element ID of the slide to activate.
