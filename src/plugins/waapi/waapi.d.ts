declare module waapi {
    export type Angle = string | number;
    export type Color = string;
    export type Distance = string | number;


    export type Easing =
        'ease'
        | 'linear'
        | 'initial'
        | 'ease-in'
        | 'ease-out'
        | 'ease-in-out'
        | 'easeInCubic'
        | 'easeOutCubic'
        | 'easeInOutCubic'
        | 'easeInCirc'
        | 'easeOutCirc'
        | 'easeInOutCirc'
        | 'easeInExpo'
        | 'easeOutExpo'
        | 'easeInOutExpo'
        | 'easeInQuad'
        | 'easeOutQuad'
        | 'easeInOutQuad'
        | 'easeInQuart'
        | 'easeOutQuart'
        | 'easeInOutQuart'
        | 'easeInQuint'
        | 'easeOutQuint'
        | 'easeInOutQuint'
        | 'easeInSine'
        | 'easeOutSine'
        | 'easeInOutSine'
        | 'easeInBack'
        | 'easeOutBack'
        | 'easeInOutBack'
        | 'elegantSlowStartEnd'
        | string;

    export interface IElementAnimate{
        animate(keyframes: IKeyframe[], timings: IEffectTiming): IAnimation;
    }

    export interface IAnimation {
        id: string;
        startTime: number;
        currentTime: number;
        playState: 'idle' | 'pending' | 'running' | 'paused' | 'finished';
        playbackRate: number;
        onfinish: Function;
        oncancel: Function;

        cancel(): void;
        finish(): void;
        play(): void;
        pause(): void;
        reverse(): void;

        addEventListener(eventName: string, listener: Function): void;
        removeEventListener(eventName: string, listener: Function): void;
    }

    export interface IEffectTiming {
        direction?: string;
        delay?: number;
        duration?: number;
        easing?: string;
        endDelay?: number;
        fill?: string;
        iterationStart?: number;
        iterations?: number;
    }

    export interface IKeyframe {
        /**
         * (description)
         * 
         * @type {number}
         */
        offset?: number;
        /**
         * Transform function to use on this keyframe
         * 
         * @type {Easing}
         */
        easing?: Easing;
        /**
         * (description)
         * 
         * @type {string}
         */
        backdropFilter?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        background?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        backgroundColor?: Color;
        /**
         * (description)
         * 
         * @type {string}
         */
        backgroundPosition?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        backgroundSize?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        border?: string;
        /**
         * (description)
         * 
         * @type {string|Distance}
         */
        borderBottom?: string | Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        borderBottomColor?: Color;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderBottomLeftRadius?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderBottomRightRadius?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderBottomWidth?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        borderColor?: Color;
        /**
         * (description)
         * 
         * @type {string|Distance}
         */
        borderLeft?: string | Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        borderLeftColor?: Color;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderLeftWidth?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderRadius?: Distance;
        /**
         * (description)
         * 
         * @type {string|Distance}
         */
        borderRight?: string | Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        borderRightColor?: Color;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderRightWidth?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        borderTop?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        borderTopColor?: Color;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderTopLeftRadius?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderTopRightRadius?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderTopWidth?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        borderWidth?: Distance;
        /**
         * (description)
         * 
         * @type {string|Distance}
         */
        bottom?: string | Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        boxShadow?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        clip?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        clipPath?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        color?: Color;
        /**
         * (description)
         * 
         * @type {string}
         */
        columnCount?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        columnGap?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        columnRule?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        columnRuleColor?: Color;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        columnRuleWidth?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        columnWidth?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        columns?: string;
        fill?: Color;
        fillOpacity?: string;
        fillRule?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        filter?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        flex?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        flexBasis?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        flexGrow?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        flexShrink?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        font?: string;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        fontSize?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        fontSizeAdjust?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        fontStretch?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        fontWeight?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        gridColumnGap?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        gridGap?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        gridRowGap?: string;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        height?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        left?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        letterSpacing?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        lineHeight?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        margin?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        marginBottom?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        marginLeft?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        marginRight?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        marginTop?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        mask?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        maskPosition?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        maskSize?: string;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        maxHeight?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        maxWidth?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        minHeight?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        minWidth?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        motionOffset?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        motionRotation?: Angle;
        /**
         * (description)
         * 
         * @type {string}
         */
        objectPosition?: Distance;
        /**
         * (description)
         * 
         * @type {number}
         */
        opacity?: number;
        /**
         * (description)
         * 
         * @type {number}
         */
        order?: number;
        /**
         * (description)
         * 
         * @type {string}
         */
        outline?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        outlineColor?: Color;
        /**
         * (description)
         * 
         * @type {string}
         */
        outlineOffset?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        outlineWidth?: string;
        /**
         * (description)
         * 
         * @type {string|Distance}
         */
        padding?: string | Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        paddingBottom?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        paddingLeft?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        paddingRight?: Distance;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        paddingTop?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        perspective?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        perspectiveOrigin?: string;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        right?: Distance;
        /**
         * ShortformFor transform: rotate3d(1, 0, 0, angle).
         * PassA singleStringWithTheAngle
         * 
         * @type {Angle}
         */
        rotateX?: Angle;
        /**
         * ShortformFor transform: rotate3d(0, 1, 0, angle).
         * PassA singleStringWithTheAngle
         * 
         * @type {Angle}
         */
        rotateY?: Angle;
        /**
         * ShortformFor transform: rotate3d(0, 0, 1, angle).
         * PassA singleStringWithTheAngle
         * 
         * @type {Angle}
         */
        rotateZ?: Angle;
        /**
         * ShortformFor transform: scale3d().
         * PassA singleNumber 
         * 
         * @type {Distance}
         */
        scale?: Distance;
        /**
         * ShortformFor transform: scaleX().
         * PassA singleNumber 
         * 
         * @type {Distance}
         */
        scaleX?: Distance;
        /**
         * ShortformFor transform: scaleY().
         * PassA singleNumber 
         * 
         * @type {Distance}
         */
        scaleY?: Distance;
        /**
         * ShortformFor transform: scaleZ().
         * PassA singleNumber 
         * 
         * @type {Distance}
         */
        scaleZ?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        scrollSnapCoordinate?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        scrollSnapDestination?: string;
        /**
         * ShortformFor transform: skewX().
         * PassA singleString 
         * 
         * @type {Distance}
         */
        skewX?: Distance;
        /**
         * ShortformFor transform: skewY().
         * PassA singleString 
         * 
         * @type {Distance}
         */
        skewY?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        shapeImageThreshold?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        shapeMargin?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        shapeOutside?: string;
        stroke?: Color;
        strokeDasharray?: string;
        strokeDashoffset?: string;
        strokeLinecap?: string;
        strokeLinejoin?: string;
        strokeMiterlimit?: string;
        strokeOpacity?: number;
        strokeWidth?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        textDecoration?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        textDecorationColor?: Color;
        /**
         * (description)
         * 
         * @type {string}
         */
        textEmphasis?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        textEmphasisColor?: Color;
        /**
         * (description)
         * 
         * @type {string}
         */
        textIndent?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        textShadow?: string;
        /**
         * (description)
         * 
         * @type {Distance}
         */
        top?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        transform?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        transformOrigin?: string;
        /**
         * Distance
         * 
         * @type {string|number}
         */
        transformPerspective?: string | number;
        /**
         * ShortformFor transform: translateX().
         * PassA singleString 
         * 
         * @type {Distance}
         */
        x?: Distance;
        translateX?: Distance;
        /**
         * ShortformFor transform: translateY().
         * PassA singleString 
         * 
         * @type {Distance}
         */
        y?: Distance;
        translateY?: Distance;
        /**
         * ShortformFor transform: translateZ().
         * PassA singleString 
         * 
         * @type {Distance}
         */
        z?: Distance;
        translateZ?: Distance;
        /**
         * (description)
         * 
         * @type {string}
         */
        verticalAlign?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        visibility?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        width?: string | number;
        /**
         * (description)
         * 
         * @type {string}
         */
        wordSpacing?: string;
        /**
         * (description)
         * 
         * @type {number}
         */
        zIndex?: number;
    }
}