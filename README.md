# web-skeleton-generator
Generate SVG skeleton image from HTML.

[Still Working in Progress]


# DEMO

## Medium
<div>
  <img style="width: 49%" src="https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/medium_before.jpg?raw=true">
  <img style="width: 49%" src="https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/medium_after.jpg?raw=true"> 
</div>

## My Blog
<div>
  <img style="width: 49%" src="https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/lynan_before.jpg?raw=true">
  <img style="width: 49%" src="https://github.com/LynanBreeze/web-skeleton-generator/blob/main/public/imgs/lynan_after.jpg?raw=true"> 
</div>


# Usage

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
