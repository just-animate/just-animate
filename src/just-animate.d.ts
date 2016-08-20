declare const just: ja.IJustAnimate;

declare module ja {
    export type FillMode = "none" | "forwards" | "backwards" | "both" | "auto";
    export type AnimationPlaybackState = "idle" | "pending" | "running" | "paused" | "finished";
    export type ElementSource = Node | Node[] | NodeList | string | IElementProvider;
    export type Angle = string | number;
    export type Color = string;
    export type Distance = string | number;
    export type Provider<T> = T | IProvider<T>;

    export type Easing = "ease"


        | "linear"
        | "initial"
        | "ease-in"
        | "ease-out"
        | "ease-in-out"
        | "easeInCubic"
        | "easeOutCubic"
        | "easeInOutCubic"
        | "easeInCirc"
        | "easeOutCirc"
        | "easeInOutCirc"
        | "easeInExpo"
        | "easeOutExpo"
        | "easeInOutExpo"
        | "easeInQuad"
        | "easeOutQuad"
        | "easeInOutQuad"
        | "easeInQuart"
        | "easeOutQuart"
        | "easeInOutQuart"
        | "easeInQuint"
        | "easeOutQuint"
        | "easeInOutQuint"
        | "easeInSine"
        | "easeOutSine"
        | "easeInOutSine"
        | "easeInBack"
        | "easeOutBack"
        | "easeInOutBack"
        | "elegantSlowStartEnd"
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
        playbackRate(value: number): void;
        playState(): AnimationPlaybackState;
        playState(value: AnimationPlaybackState): void;
        reverse(): void;
        totalDuration(): number;
        onupdate(context: IAnimationTimeContext): void;
    }

    export interface IAnimationTimeContext {
        offset(): number;
        relativeOffset(): number;
        delta(): number;
        totalDuration(): number;
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

    /**
     * (description)
     * 
     * @export
     * @interface IElementProvider
     */
    export interface IElementProvider {
        (): ElementSource;
    }

    export interface IAnimationMixin extends IAnimation {
        name: string;
    }

    export interface IAnimation {
        css?: ICssPropertyOptions | ICssKeyframeOptions[];
        easing?: Easing;
        fill?: Provider<FillMode>;
        iterations?: Provider<number>;
        direction?: Provider<string>;
        iterationStart?: Provider<number>;
        delay?: Provider<number>;
        to: number;
    }

    export interface IAnimationOptions extends IAnimation {
        targets?: ElementSource;
        from?: number;
        mixins?: string | string[];
    }

    /**
     * Describes an animation keyframe
     * 
     * @export
     * @interface IKeyframe
     */
    export interface ICssPropertyOptions {
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        backdropFilter?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        background?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        backgroundColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        backgroundPosition?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        backgroundSize?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        border?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|Distance|(string|Distance)[]}
         */
        borderBottom?: string | Distance | (string | Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        borderBottomColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderBottomLeftRadius?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderBottomRightRadius?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderBottomWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        borderColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {string|Distance|(string|Distance)[]}
         */
        borderLeft?: string | Distance | (string | Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        borderLeftColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderLeftWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderRadius?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|Distance|(string|Distance)[]}
         */
        borderRight?: string | Distance | (string | Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        borderRightColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderRightWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        borderTop?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        borderTopColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderTopLeftRadius?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderTopRightRadius?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderTopWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        borderWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|Distance|(string|Distance)[]}
         */
        bottom?: string | Distance | (string | Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        boxShadow?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        clip?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        clipPath?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        color?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        columnCount?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        columnGap?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        columnRule?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        columnRuleColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        columnRuleWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        columnWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        columns?: string | (string)[];
        fill?: Color | (Color)[];
        fillOpacity?: string | (string)[];
        fillRule?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        filter?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        flex?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        flexBasis?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        flexGrow?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        flexShrink?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        font?: string | (string)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        fontSize?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        fontSizeAdjust?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        fontStretch?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        fontWeight?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        gridColumnGap?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        gridGap?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        gridRowGap?: string | (string)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        height?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        left?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        letterSpacing?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        lineHeight?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        margin?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        marginBottom?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        marginLeft?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        marginRight?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        marginTop?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        mask?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        maskPosition?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        maskSize?: string | (string)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        maxHeight?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        maxWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        minHeight?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        minWidth?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        motionOffset?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        motionRotation?: Angle | (Angle)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        objectPosition?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {number|(number)[]}
         */
        opacity?: number | (number)[];
        /**
         * (description)
         * 
         * @type {number|(number)[]}
         */
        order?: number | (number)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        outline?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        outlineColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        outlineOffset?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        outlineWidth?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|Distance|(string|Distance)[]}
         */
        padding?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        paddingBottom?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        paddingLeft?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        paddingRight?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        paddingTop?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        perspective?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        perspectiveOrigin?: string | (string)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        right?: Distance | (Distance)[];
        /**
         * ShortformFor transform: rotate3d(1, 0, 0, angle).
         * PassA singleStringWithTheAngle
         * 
         * @type {Angle|(Angle)[]}
         */
        rotateX?: Angle | (Angle)[];
        /**
         * ShortformFor transform: rotate3d(0, 1, 0, angle).
         * PassA singleStringWithTheAngle
         * 
         * @type {Angle|(Angle)[]}
         */
        rotateY?: Angle | (Angle)[];
        /**
         * ShortformFor transform: rotate3d(0, 0, 1, angle).
         * PassA singleStringWithTheAngle
         * 
         * @type {Angle|(Angle)[]}
         */
        rotateZ?: Angle | (Angle)[];
        /**
         * ShortformFor transform: scale3d().
         * PassA singleNumber 
         * 
         * @type {Distance|(Distance)[]}
         */
        scale?: Distance | (Distance)[];
        /**
         * ShortformFor transform: scaleX().
         * PassA singleNumber 
         * 
         * @type {Distance|(Distance)[]}
         */
        scaleX?: Distance | (Distance)[];
        /**
         * ShortformFor transform: scaleY().
         * PassA singleNumber 
         * 
         * @type {Distance|(Distance)[]}
         */
        scaleY?: Distance | (Distance)[];
        /**
         * ShortformFor transform: scaleZ().
         * PassA singleNumber 
         * 
         * @type {Distance|(Distance)[]}
         */
        scaleZ?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        scrollSnapCoordinate?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        scrollSnapDestination?: string | (string)[];
        /**
         * ShortformFor transform: skewX().
         * PassA singleString 
         * 
         * @type {Distance|(Distance)[]}
         */
        skewX?: Distance | (Distance)[];
        /**
         * ShortformFor transform: skewY().
         * PassA singleString 
         * 
         * @type {Distance|(Distance)[]}
         */
        skewY?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        shapeImageThreshold?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        shapeMargin?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        shapeOutside?: string | (string)[];
        stroke?: Color | (Color)[];
        strokeDasharray?: string | (string)[];
        strokeDashoffset?: string | (string)[];
        strokeLinecap?: string | (string)[];
        strokeLinejoin?: string | (string)[];
        strokeMiterlimit?: string | (string)[];
        strokeOpacity?: number | (number)[];
        strokeWidth?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        textDecoration?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        textDecorationColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        textEmphasis?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        textEmphasisColor?: Color | (Color)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        textIndent?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        textShadow?: string | (string)[];
        /**
         * (description)
         * 
         * @type {Distance|(Distance)[]}
         */
        top?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        transform?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        transformOrigin?: string | (string)[];
        /**
         * Distance
         * 
         * @type {string|number|(string|number)[]}
         */
        transformPerspective?: string | number | (string | number)[];
        /**
         * ShortformFor transform: translateX().
         * PassA singleString 
         * 
         * @type {Distance|(Distance)[]}
         */
        x?: Distance | (Distance)[];
        translateX?: Distance | (Distance)[];
        /**
         * ShortformFor transform: translateY().
         * PassA singleString 
         * 
         * @type {Distance|(Distance)[]}
         */
        y?: Distance | (Distance)[];
        translateY?: Distance | (Distance)[];
        /**
         * ShortformFor transform: translateZ().
         * PassA singleString 
         * 
         * @type {Distance|(Distance)[]}
         */
        z?: Distance | (Distance)[];
        translateZ?: Distance | (Distance)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        verticalAlign?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        visibility?: string | (string)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        width?: string | number | (string | number)[];
        /**
         * (description)
         * 
         * @type {string|(string)[]}
         */
        wordSpacing?: string | (string)[];
        /**
         * (description)
         * 
         * @type {number|(number)[]}
         */
        zIndex?: number | (number)[];
    }

    /**
     * Describes an animation keyframe
     * 
     * @export
     * @interface IKeyframe
     */
    export interface ICssKeyframeOptions {
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

    /**
     * (description)
     * 
     * @export
     * @interface IMap
     * @template T
     */
    export interface IMap<T> {
        [name: string]: T;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IMapper
     * @template T1
     * @template T2
     */
    export interface IMapper<T1, T2> {
        (mapable: T1): T2;
    }

    /**
     * (description)
     * 
     * @export T1
     * @interface IFunc
     * @template T1
     */
    export interface IFunc<T1> {
        (mapable: T1): T1;
    }

    export interface IProvider<T> {
        (): T;
    }
}
