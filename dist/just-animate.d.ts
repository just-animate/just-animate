declare const just: ja.IJustAnimate;
declare module ja {
    export type FillMode = 'none' | 'forwards' | 'backwards' | 'both' | 'auto';
    export type AnimationPlaybackState = 'idle' | 'pending' | 'running' | 'paused' | 'finished';
    export type AnimationTarget = Node | Node[] | NodeList | string | { (): AnimationTarget };
    export type Angle = string | number;
    export type Color = string;
    export type Distance = string | number;
    export type Resolver<T> = T | IResolver<T>;
    export type Easing = 'ease'
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
    
    export interface IJustAnimate {
        animate(options: ja.IAnimationOptions | ja.IAnimationOptions): ja.IAnimator;
        inject(animationOptionList: ja.IAnimationOptions[]): void;
        register(animationOptions: ja.IAnimationOptions): void;
    }
    export interface IPlugin {
        handle(options: ja.IAnimationOptions): ja.IAnimationController[];
        canHandle(options: ja.IAnimationOptions): boolean;
    }
    export interface ITimelineEvent {
        startTimeMs: number;
        endTimeMs: number;
        animator: IAnimationController;
    }
    export interface IAnimationController {
        seek(value: number): void;
        totalDuration: number;
        playbackRate(value: number): void;
        playState(): AnimationPlaybackState;
        playState(value: AnimationPlaybackState): void;
        reverse(): void;
        onupdate(context: IAnimationTimeContext): void;
    }
    export interface IAnimationTimeContext {
        currentTime: number;
        delta: number;
        duration: number;
        offset: number;
        playbackRate: number;
    }
    export interface IAnimator {
        animate(options: ja.IAnimationOptions | ja.IAnimationOptions[]): ja.IAnimator;
        currentTime(): number;
        currentTime(value: number): IAnimator;
        playbackRate(): number;
        playbackRate(value: number): IAnimator;
        duration(): number;
        playState(): AnimationPlaybackState;
        finish(): IAnimator;
        play(): IAnimator;
        pause(): IAnimator;
        reverse(): IAnimator;
        cancel(): IAnimator;
        on(eventName: string, listener: Function): IAnimator;
        off(eventName: string, listener: Function): IAnimator;
    }
    export interface IAnimationMixin extends IAnimation {
        name: string;
    }
    export interface IAnimation {
        css?: ICssPropertyOptions | ICssKeyframeOptions[];
        delay?: Resolver<number>;  
        direction?: Resolver<string>;        
        easing?: Easing;
        endDelay?: Resolver<number>;
        fill?: Resolver<FillMode>;
        iterations?: Resolver<number>;
        iterationStart?: Resolver<number>;
        to: number;
    }
    export interface IAnimationOptions extends IAnimation {
        targets?: AnimationTarget;
        from?: number;
        mixins?: string | string[];
        isTransition: boolean;
        update?: { (): void|any };
    }
    export interface ICssPropertyOptions {
        backdropFilter?: Resolver<string | (string)[]>;
        background?: Resolver<string | (string)[]>;
        backgroundColor?: Resolver<Color | (Color)[]>;
        backgroundPosition?: Resolver<string | (string)[]>;
        backgroundSize?: Resolver<string | (string)[]>;
        border?: Resolver<string | (string)[]>;
        borderBottom?: Resolver<string | Distance | (string | Distance)[]>;
        borderBottomColor?: Resolver<Color | (Color)[]>;
        borderBottomLeftRadius?: Resolver<Distance | (Distance)[]>;
        borderBottomRightRadius?: Resolver<Distance | (Distance)[]>;
        borderBottomWidth?: Resolver<Distance | (Distance)[]>;
        borderColor?: Resolver<Color | (Color)[]>;
        borderLeft?: Resolver<string | Distance | (string | Distance)[]>;
        borderLeftColor?: Resolver<Color | (Color)[]>;
        borderLeftWidth?: Resolver<Distance | (Distance)[]>;
        borderRadius?: Resolver<Distance | (Distance)[]>;
        borderRight?: Resolver<string | Distance | (string | Distance)[]>;
        borderRightColor?: Resolver<Color | (Color)[]>;
        borderRightWidth?: Resolver<Distance | (Distance)[]>;
        borderTop?: Resolver<string | (string)[]>;
        borderTopColor?: Resolver<Color | (Color)[]>;
        borderTopLeftRadius?: Resolver<Distance | (Distance)[]>;
        borderTopRightRadius?: Resolver<Distance | (Distance)[]>;
        borderTopWidth?: Resolver<Distance | (Distance)[]>;
        borderWidth?: Resolver<Distance | (Distance)[]>;
        bottom?: Resolver<string | Distance | (string | Distance)[]>;
        boxShadow?: Resolver<string | (string)[]>;
        clip?: Resolver<string | (string)[]>;
        clipPath?: Resolver<string | (string)[]>;
        color?: Resolver<Color | (Color)[]>;
        columnCount?: Resolver<string | (string)[]>;
        columnGap?: Resolver<string | (string)[]>;
        columnRule?: Resolver<string | (string)[]>;
        columnRuleColor?: Resolver<Color | (Color)[]>;
        columnRuleWidth?: Resolver<Distance | (Distance)[]>;
        columnWidth?: Resolver<Distance | (Distance)[]>;
        columns?: Resolver<string | (string)[]>;
        fill?: Resolver<Color | (Color)[]>;
        fillOpacity?: Resolver<string | (string)[]>;
        fillRule?: Resolver<string | (string)[]>;
        filter?: Resolver<string | (string)[]>;
        flex?: Resolver<string | (string)[]>;
        flexBasis?: Resolver<string | (string)[]>;
        flexGrow?: Resolver<string | (string)[]>;
        flexShrink?: Resolver<string | (string)[]>;
        font?: Resolver<string | (string)[]>;
        fontSize?: Resolver<Distance | (Distance)[]>;
        fontSizeAdjust?: Resolver<string | (string)[]>;
        fontStretch?: Resolver<string | (string)[]>;
        fontWeight?: Resolver<string | (string)[]>;
        gridColumnGap?: Resolver<string | (string)[]>;
        gridGap?: Resolver<string | (string)[]>;
        gridRowGap?: Resolver<string | (string)[]>;
        height?: Resolver<Distance | (Distance)[]>;
        left?: Resolver<Distance | (Distance)[]>;
        letterSpacing?: Resolver<Distance | (Distance)[]>;
        lineHeight?: Resolver<Distance | (Distance)[]>;
        margin?: Resolver<Distance | (Distance)[]>;
        marginBottom?: Resolver<Distance | (Distance)[]>;
        marginLeft?: Resolver<Distance | (Distance)[]>;
        marginRight?: Resolver<Distance | (Distance)[]>;
        marginTop?: Resolver<Distance | (Distance)[]>;
        mask?: Resolver<string | (string)[]>;
        maskPosition?: Resolver<string | (string)[]>;
        maskSize?: Resolver<string | (string)[]>;
        maxHeight?: Resolver<Distance | (Distance)[]>;
        maxWidth?: Resolver<Distance | (Distance)[]>;
        minHeight?: Resolver<Distance | (Distance)[]>;
        minWidth?: Resolver<Distance | (Distance)[]>;
        motionOffset?: Resolver<Distance | (Distance)[]>;
        motionRotation?: Resolver<Angle | (Angle)[]>;
        objectPosition?: Resolver<Distance | (Distance)[]>;
        opacity?: Resolver<number | (number)[]>;
        order?: Resolver<number | (number)[]>;
        outline?: Resolver<string | (string)[]>;
        outlineColor?: Resolver<Color | (Color)[]>;
        outlineOffset?: Resolver<string | (string)[]>;
        outlineWidth?: Resolver<string | (string)[]>;
        padding?: Resolver<Distance | (Distance)[]>;
        paddingBottom?: Resolver<Distance | (Distance)[]>;
        paddingLeft?: Resolver<Distance | (Distance)[]>;
        paddingRight?: Resolver<Distance | (Distance)[]>;
        paddingTop?: Resolver<Distance | (Distance)[]>;
        perspective?: Resolver<string | (string)[]>;
        perspectiveOrigin?: Resolver<string | (string)[]>;
        right?: Resolver<Distance | (Distance)[]>;
        rotateX?: Resolver<Angle | (Angle)[]>;
        rotateY?: Resolver<Angle | (Angle)[]>;
        rotateZ?: Resolver<Angle | (Angle)[]>;
        scale?: Resolver<Distance | (Distance)[]>;
        scaleX?: Resolver<Distance | (Distance)[]>;
        scaleY?: Resolver<Distance | (Distance)[]>;
        scaleZ?: Resolver<Distance | (Distance)[]>;
        scrollSnapCoordinate?: Resolver<string | (string)[]>;
        scrollSnapDestination?: Resolver<string | (string)[]>;
        skewX?: Resolver<Distance | (Distance)[]>;
        skewY?: Resolver<Distance | (Distance)[]>;
        shapeImageThreshold?: Resolver<string | (string)[]>;
        shapeMargin?: Resolver<string | (string)[]>;
        shapeOutside?: Resolver<string | (string)[]>;
        stroke?: Resolver<Color | (Color)[]>;
        strokeDasharray?: Resolver<string | (string)[]>;
        strokeDashoffset?: Resolver<string | (string)[]>;
        strokeLinecap?: Resolver<string | (string)[]>;
        strokeLinejoin?: Resolver<string | (string)[]>;
        strokeMiterlimit?: Resolver<string | (string)[]>;
        strokeOpacity?: Resolver<number | (number)[]>;
        strokeWidth?: Resolver<string | (string)[]>;
        textDecoration?: Resolver<string | (string)[]>;
        textDecorationColor?: Resolver<Color | (Color)[]>;
        textEmphasis?: Resolver<string | (string)[]>;
        textEmphasisColor?: Resolver<Color | (Color)[]>;
        textIndent?: Resolver<string | (string)[]>;
        textShadow?: Resolver<string | (string)[]>;
        top?: Resolver<Distance | (Distance)[]>;
        transform?: Resolver<string | (string)[]>;
        transformOrigin?: Resolver<string | (string)[]>;
        transformPerspective?: Resolver<string | number | (string | number)[]>;
        x?: Resolver<Distance | (Distance)[]>;
        translateX?: Resolver<Distance | (Distance)[]>;
        y?: Resolver<Distance | (Distance)[]>;
        translateY?: Resolver<Distance | (Distance)[]>;
        z?: Resolver<Distance | (Distance)[]>;
        translateZ?: Resolver<Distance | (Distance)[]>;
        verticalAlign?: Resolver<string | (string)[]>;
        visibility?: Resolver<string | (string)[]>;
        width?: Resolver<string | number | (string | number)[]>;
        wordSpacing?: Resolver<string | (string)[]>;
        zIndex?: Resolver<number | (number)[]>;
    }

    export interface ICssKeyframeOptions {
        offset?: number | number[];
        easing?: Resolver<Easing>;
        backdropFilter?: Resolver<string>;
        background?: Resolver<string>;
        backgroundColor?: Resolver<Color>;
        backgroundPosition?: Resolver<string>;
        backgroundSize?: Resolver<string>;
        border?: Resolver<string>;
        borderBottom?: Resolver<string | Distance>;
        borderBottomColor?: Resolver<Color>;
        borderBottomLeftRadius?: Resolver<Distance>;
        borderBottomRightRadius?: Resolver<Distance>;
        borderBottomWidth?: Resolver<Distance>;
        borderColor?: Resolver<Color>;
        borderLeft?: Resolver<string | Distance>;
        borderLeftColor?: Resolver<Color>;
        borderLeftWidth?: Resolver<Distance>;
        borderRadius?: Resolver<Distance>;
        borderRight?: Resolver<string | Distance>;
        borderRightColor?: Resolver<Color>;
        borderRightWidth?: Resolver<Distance>;
        borderTop?: Resolver<string>;
        borderTopColor?: Resolver<Color>;
        borderTopLeftRadius?: Resolver<Distance>;
        borderTopRightRadius?: Resolver<Distance>;
        borderTopWidth?: Resolver<Distance>;
        borderWidth?: Resolver<Distance>;
        bottom?: Resolver<string | Distance>;
        boxShadow?: Resolver<string>;
        clip?: Resolver<string>;
        clipPath?: Resolver<string>;
        color?: Resolver<Color>;
        columnCount?: Resolver<string>;
        columnGap?: Resolver<string>;
        columnRule?: Resolver<string>;
        columnRuleColor?: Resolver<Color>;
        columnRuleWidth?: Resolver<Distance>;
        columnWidth?: Resolver<Distance>;
        columns?: Resolver<string>;
        fill?: Resolver<Color>;
        fillOpacity?: Resolver<string>;
        fillRule?: Resolver<string>;
        filter?: Resolver<string>;
        flex?: Resolver<string>;
        flexBasis?: Resolver<string>;
        flexGrow?: Resolver<string>;
        flexShrink?: Resolver<string>;
        font?: Resolver<string>;
        fontSize?: Resolver<Distance>;
        fontSizeAdjust?: Resolver<string>;
        fontStretch?: Resolver<string>;
        fontWeight?: Resolver<string>;
        gridColumnGap?: Resolver<string>;
        gridGap?: Resolver<string>;
        gridRowGap?: Resolver<string>;
        height?: Resolver<Distance>;
        left?: Resolver<Distance>;
        letterSpacing?: Resolver<Distance>;
        lineHeight?: Resolver<Distance>;
        margin?: Resolver<Distance>;
        marginBottom?: Resolver<Distance>;
        marginLeft?: Resolver<Distance>;
        marginRight?: Resolver<Distance>;
        marginTop?: Resolver<Distance>;
        mask?: Resolver<string>;
        maskPosition?: Resolver<string>;
        maskSize?: Resolver<string>;
        maxHeight?: Resolver<Distance>;
        maxWidth?: Resolver<Distance>;
        minHeight?: Resolver<Distance>;
        minWidth?: Resolver<Distance>;
        motionOffset?: Resolver<Distance>;
        motionRotation?: Resolver<Angle>;
        objectPosition?: Resolver<Distance>;
        opacity?: Resolver<number>;
        order?: Resolver<number>;
        outline?: Resolver<string>;
        outlineColor?: Resolver<Color>;
        outlineOffset?: Resolver<string>;
        outlineWidth?: Resolver<string>;
        padding?: Resolver<string | Distance>;
        paddingBottom?: Resolver<Distance>;
        paddingLeft?: Resolver<Distance>;
        paddingRight?: Resolver<Distance>;
        paddingTop?: Resolver<Distance>;
        perspective?: Resolver<string>;
        perspectiveOrigin?: Resolver<string>;
        right?: Resolver<Distance>;
        rotateX?: Resolver<Angle>;
        rotateY?: Resolver<Angle>;
        rotateZ?: Resolver<Angle>;
        scale?: Resolver<Distance>;
        scaleX?: Resolver<Distance>;
        scaleY?: Resolver<Distance>;
        scaleZ?: Resolver<Distance>;
        scrollSnapCoordinate?: Resolver<string>;
        scrollSnapDestination?: Resolver<string>;
        skewX?: Resolver<Distance>;
        skewY?: Resolver<Distance>;
        shapeImageThreshold?: Resolver<string>;
        shapeMargin?: Resolver<string>;
        shapeOutside?: Resolver<string>;
        stroke?: Resolver<Color>;
        strokeDasharray?: Resolver<string>;
        strokeDashoffset?: Resolver<string>;
        strokeLinecap?: Resolver<string>;
        strokeLinejoin?: Resolver<string>;
        strokeMiterlimit?: Resolver<string>;
        strokeOpacity?: Resolver<number>;
        strokeWidth?: Resolver<string>;
        textDecoration?: Resolver<string>;
        textDecorationColor?: Resolver<Color>;
        textEmphasis?: Resolver<string>;
        textEmphasisColor?: Resolver<Color>;
        textIndent?: Resolver<string>;
        textShadow?: Resolver<string>;
        top?: Resolver<Distance>;
        transform?: Resolver<string>;
        transformOrigin?: Resolver<string>;
        transformPerspective?: Resolver<string | number>;
        x?: Resolver<Distance>;
        translateX?: Resolver<Distance>;
        y?: Resolver<Distance>;
        translateY?: Resolver<Distance>;
        z?: Resolver<Distance>;
        translateZ?: Resolver<Distance>;
        verticalAlign?: Resolver<string>;
        visibility?: Resolver<string>;
        width?: Resolver<string | number>;
        wordSpacing?: Resolver<string>;
        zIndex?: Resolver<number>;
    }

    export interface IMap<T> {
        [name: string]: T;
    }

    export interface IMapper<T1, T2> {
        (mapable: T1): T2;
    }

    export interface IFunc<T1> {
        (mapable: T1): T1;
    }
    export interface IResolver<T> {
        (): T;
    }
}
