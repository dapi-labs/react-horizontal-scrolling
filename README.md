# react-horizontal-scrolling
[![Version](http://img.shields.io/npm/v/react-horizontal-scrolling.svg)](https://www.npmjs.org/package/react-horizontal-scrolling)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm download][download-image]][download-url]

[download-image]: https://img.shields.io/npm/dm/react-horizontal-scrolling.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-horizontal-scrolling

## Installation

```sh
npm install react-horizontal-scrolling
```

## Features
* Support horizontal dragging
* Support vertical mouse wheel
* Tween animation (mainly copied from [malihu-custom-scrollbar-plugin](https://github.com/malihu/malihu-custom-scrollbar-plugin))

## Usage

```js
import HorizontalScroll from 'react-horizontal-scrolling'

<HorizontalScroll>
  {pictures.map((pic, idx) => (
    <img
      className="rounded w-56 h-64 object-cover"
      src={pic}
      key={idx} />
  ))}
</HorizontalScroll>
```

![](https://user-images.githubusercontent.com/5305874/103135320-6eceab00-46f2-11eb-80c7-9ff50842b078.gif)


## License

MIT
