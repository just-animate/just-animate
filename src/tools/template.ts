export const template = `<div id="ja-controls">
<div id="ja-play">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M3 22v-20l18 10-18 10z"/>
   </svg>
</div>
<div id="ja-pause">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z"/>
   </svg>
</div>
<div id="ja-cancel">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
   <path d="M2 2h20v20h-20z"/>
</svg>
</div>
<div id="ja-reverse">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6 13v4l-6-5 6-5v4h3v2h-3zm9-2v2h3v4l6-5-6-5v4h-3zm-4-6v14h2v-14h-2z"/>
   </svg>
</div>
<input id="ja-scrubber" type="range" min="0" step="1" max="1000" value="0" />
<input id="ja-seek" type="number" placeholder="0ms" />
<div>
   <button data-ja-rate value=".1">10%</button>
   <button data-ja-rate value=".5">50%</button>
   <button data-ja-rate value="1" class="active">100%</button>
</div>
</div>`
