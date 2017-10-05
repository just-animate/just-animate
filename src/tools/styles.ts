
const colorFillLower = '#2a6495'
const colorFillUpper = '#7AC7C4'
const boxShadow1 = '1px 1px 1px #000000, 0px 0px 1px #0d0d0d'
const thumbHeight = '24px'
const thumbWidth = '4px'
const trackHeight = '4px'
const thumbColor = '#9ba6c0'
const border = '0.2px solid #010101'

export const styles = `<style style="display:none">
#ja-controls { 
   position: fixed;
   bottom: 10px;
   right: 10px;
   background-color: rgba(0, 0, 0, .8);
   border: solid thin rgba(255, 255, 255, .4);
   border-radius: 5px;
   padding: 0;
}
#ja-controls > * { 
   vertical-align: middle;
   display: inline-block;
   padding: 2px 5px;
}
#ja-controls button[data-ja-rate] {
   background: none;
   border: solid thin rgb(175, 173, 173);
   font-size: .8em;
   border-radius: 4px;
   cursor: pointer;
}
#ja-controls button[data-ja-rate]:hover {
   background-color: black;
}
#ja-controls button[data-ja-rate].active {
   background-color: #4f5d7d; 
}
#ja-controls path {
    fill: currentColor;
}
#ja-play, #ja-pause, #ja-reverse, #ja-cancel {
   height: 1em;
   width: 1em;
   cursor: pointer;
}
#ja-seek {
   width: 50px;
   text-align: right; 
   font-size: .8em;
   color: white;
   background-color: transparent;
   border: none;
   -moz-appearance: textfield;
} 

#ja-seek::-webkit-inner-spin-button, 
#ja-seek::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

#ja-controls * { 
   font-family: Arial;
   font-size: 12pt;
   color: white; 
}
#ja-controls > button[data-ja-rate] { 
   font-size: .8em;
}

#ja-controls > input[type=range] {
  -webkit-appearance: none;
  padding: 0;
  height: 30px;
  background-color: transparent;
}
#ja-controls > input[type=range]:focus {
  outline: none;
}
#ja-controls > input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: ${trackHeight};
  cursor: pointer;
  animate: 0.2s;
  box-shadow: ${boxShadow1};
  background: ${colorFillUpper};
  border-radius: 1.3px;
  border: ${border};
}
#ja-controls > input[type=range]::-webkit-slider-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: ${border};
  height: ${thumbHeight};
  width: ${thumbWidth};
  border-radius: 3px;
  background: ${thumbColor};
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -10px;
}
#ja-controls > input[type=range]:focus::-webkit-slider-runnable-track {
  background: ${colorFillUpper};
}
#ja-controls > input[type=range]::-moz-range-track {
  width: 100%;
  height: ${trackHeight};
  cursor: pointer;
  animate: 0.2s;
  box-shadow:  ${boxShadow1};
  background: ${colorFillUpper};
  border-radius: 1.3px;
  border: ${border};
}
#ja-controls > input[type=range]::-moz-range-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: ${border};
  height: ${thumbHeight};
  width: ${thumbWidth};
  border-radius: 3px;
  background: ${thumbColor};
  cursor: pointer;
}
#ja-controls > input[type=range]::-ms-track {
  width: 100%;
  height: ${trackHeight};
  cursor: pointer; 
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  color: transparent;
}
#ja-controls > input[type=range]::-ms-fill-lower {
  background: ${colorFillLower};
  border: ${border};
  border-radius: 2.6px;
  box-shadow: ${boxShadow1};
}
#ja-controls > input[type=range]::-ms-fill-upper {
  background: ${colorFillUpper};
  border: ${border};
  border-radius: 2.6px;
  box-shadow:  ${boxShadow1};
}
#ja-controls > input[type=range]::-ms-thumb {
  box-shadow: ${boxShadow1};
  border: ${border};
  height: ${thumbHeight};
  width: ${thumbWidth};
  margin-top: 1px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
#ja-controls > input[type=range]:focus::-ms-fill-lower {
  background: ${colorFillUpper};
}
#ja-controls > input[type=range]:focus::-ms-fill-upper {
  background: ${colorFillUpper};
}

</style>`
