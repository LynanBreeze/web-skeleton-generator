# web-skeleton-generator
Generate SVG skeleton image from HTML.
The process looks like this:
![](https://r2-assets.lynan.cn/u/ezgif-4-a36ef92550-f4jtgy.gif)

[Still Working in Progress]


| Original | Generation |
|--------|-------|
| ![](https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/medium_before.jpg?raw=true)     | ![](https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/medium.svg?raw=true)     |
| ![](https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/lynan_before.jpg?raw=true)      | ![](https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/lynan_after.jpg?raw=true)     |
| ![](https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/youtube_before.jpg?raw=true)      | ![](https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/youtube_after.jpg?raw=true)     |

## Usage

Copy and run `index.js` code in browser console.

or

```javascript
(() => {
  var script = document.createElement('script');
  script.src = ''; // path to index.min.js
  document.head.appendChild(script);
  script.onload = function() {
    generateSvg().then(res=>{
        console.log(res) // SVG string output
      })
  };
})()
```

### Paramaters

Parameters of `generateSvg(element, options)` can be configured as you need.

| parameter | optional value                    | default value                                |
|-----------|-----------------------------------|----------------------------------------------|
| element       | HTMLElement, Selector             | `document.body`                              |
| options   | {<br>    inScreenOnly: boolean,<br> fillColor: string<br>} | {<br>    inScreenOnly: true,<br>fillColor: "rgba(227, 227, 227, 0.8)"<br>}<br> |
