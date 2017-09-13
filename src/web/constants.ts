import { csvToList } from '../lib/utils/strings'

export const RUNNING = 'running'

export const PX = 'px'
export const DEG = 'deg'

export const X = 'X'
export const Y = 'Y'
export const Z = 'Z'

export const TRANSLATE = 'translate'
export const TRANSFORM = 'transform'

export const transformAngles = csvToList('rotateX,rotateY,rotateZ,rotate')
export const transformScales = csvToList('scaleX,scaleY,scaleZ,scale')
export const transformLengths = csvToList('perspective,x,y,z')

export const transforms = transformAngles.concat(transformScales, transformLengths)

export const aliases = {
  x: TRANSLATE + X,
  y: TRANSLATE + Y,
  z: TRANSLATE + Z
}

// animatable length properties
// tslint:disable-next-line:max-line-length
export const cssLengths = csvToList(
  `backgroundSize,border,borderBottom,borderBottomLeftRadius,borderBottomRightRadius,borderBottomWidth,borderLeft,borderLeftWidth,borderRadius,borderRight,borderRightWidth,borderTop,borderTopLeftRadius,borderTopRightRadius,borderTopWidth,borderWidth,bottom,columnGap,columnRuleWidth,columnWidth,columns,flexBasis,font,fontSize,gridColumnGap,gridGap,gridRowGap,height,left,letterSpacing,lineHeight,margin,marginBottom,marginLeft,marginRight,marginTop,maskSize,maxHeight,maxWidth,minHeight,minWidth,outline,outlineOffset,outlineWidth,padding,paddingBottom,paddingLeft,paddingRight,paddingTop,perspective,right,shapeMargin,tabSize,top,width,wordSpacing`
)
export const cssProps = [TRANSFORM].concat(transforms, cssLengths)
