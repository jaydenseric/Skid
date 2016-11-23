# ![Skid](https://cdn.rawgit.com/jaydenseric/Skid/v4.0.0/skid-logo.svg)

![NPM version](https://img.shields.io/npm/v/skid-slider.svg?style=flat-square) ![Github issues](https://img.shields.io/github/issues/jaydenseric/Skid.svg?style=flat-square) ![Github stars](https://img.shields.io/github/stars/jaydenseric/Skid.svg?style=flat-square)

An ultra-lightweight slider that supports touch.

- ~2 KB compressed.
- Browser support: [> 2%](http://browserl.ist/?q=%3E+2%25).
- [MIT license](https://en.wikipedia.org/wiki/MIT_License).

## Setup

### HTML

Skid expects the following HTML structure:

```html
<section class="skid drag">
  <ol class="slides">
    <li class="active" id="first">
      <!-- Content -->
    </li><li id="second">
      <!-- Content -->
    </li><li id="third">
      <!-- Content -->
    </li>
  </ol>
  <nav>
    <a href="#/third" class="prior">Prior</a>
    <ol>
      <li><a href="#/first" class="active">1</a></li>
      <li><a href="#/second">2</a></li>
      <li><a href="#/third">3</a></li>
    </ol>
    <a href="#/second" class="next">Next</a>
  </nav>
</section>
```

Make sure there are no spaces or line breaks between slide elements to avoid whitespace issues.

### CSS

Add and customize the source styles from [`src/index.css`](src/index.css), or use the compiled styles in `node_modules/dist/skid.css`.

### JS

Skid requires a Hurdler instance – see the [Hurdler project](https://github.com/jaydenseric/Hurdler) for setup instructions.

Be sure to use the [DOM4 polyfill](https://github.com/WebReflection/dom4) or manually handle:

- [`query`](http://stackoverflow.com/a/38245620)
- [`classList`](http://caniuse.com/#feat=classlist)
- [`CustomEvent`](http://caniuse.com/#feat=customevent)
- [`requestAnimationFrame` & `cancelAnimationFrame`](http://caniuse.com/#feat=requestanimationframe)

Install Skid in your project as an NPM dependency:

```sh
npm install skid-slider --save
```

Import it:

```javascript
import Skid from 'skid-slider'
```

Initialize it after DOM ready:

```javascript
const skid = new Skid.Slider({
  element: document.querySelector('.skid'),
  hurdler
})
```

## Events

Events can be listed for using `addEventListener`.

Element | Event       | Description
:------ | :---------- | :----------------------------------------
Slider  | `activated` | A slide in the slider has been activated.
Slide   | `active`    | The slide is now active.

## API

### Skid

A slider utilizing Hurdler for URL hash based control.

#### Slider

Constructs a new Skid slider instance.

**Parameters**

- `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Initialization options.

  - `options.element` **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)** Container.
  - `options.slides` **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)?** Slides container.
  - `options.priorLink` **([HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) | [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean))?** Prior slide link, or false.
  - `options.nextLink` **([HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) | [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean))?** Next slide link, or false.
  - `options.tabs` **([HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) | [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean))?** Tab links container, or false.
  - `options.dragClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** Container class name to enable drag and flick. (optional, default `'drag'`)
  - `options.draggingClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** Container class name for dragging state. (optional, default `'dragging'`)

- `hurdler` **Hurdler** Hurdler instance.

##### getSlideBefore

Gets the slide before a slide.

**Parameters**

- `slide` **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)** Slide after the desired slide.

Returns **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)** The slide before the input slide.

##### getSlideAfter

Gets the slide after a slide.

**Parameters**

- `slide` **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)** Slide before the desired slide.

Returns **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)** The slide after the input slide.

##### activateSlide

Activates a slide and pans the slider to it.

**Parameters**

- `slide` **([HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** Element or ID of the slide to activate.
