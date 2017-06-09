interface AnimationEffectTiming {
    direction?: string;
    delay?: number;
    duration?: number;
    easing?: string;
    endDelay?: number;
    fill?: string;
    iterationStart?: number;
    iterations?: number;
}

interface Keyframe {
    offset?: number;
    easing?: string;
    transform?: string;
    [val: string]: string | number;
}

interface Animation {
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

interface Element {
    animate(keyframes: Keyframe[], timings: AnimationEffectTiming): Animation;
}

declare const just: {
    animate(options: ja.AnimationOptions | ja.AnimationOptions[]): ja.IAnimator;
    random(first: number, last: number, unit?: string, wholeNumbersOnly?: boolean): number | string;
    shuffle<T>(choices: T[]): T;
    splitText(target: ja.AnimationTarget): ja.SplitTextResult;
};

declare module ja {
    export type FillMode = 'none' | 'forwards' | 'backwards' | 'both' | 'auto';
    export type AnimationPlaybackState = 'fatal' | 'idle' | 'pending' | 'running' | 'paused' | 'finished';
    export type AnimationDomTarget = Node | NodeList | string;
    export type AnimationTarget = AnimationDomTarget | AnimationDomTarget[] | { (): AnimationTarget };
    export type AnimationDirection = 'normal' | 'alternate';
    export type Angle = string | number;
    export type Color = string;
    export type Distance = string | number;
    export type Resolvable<T> = T | Resolver<T>;

    export type AnimationTiming = {
        direction?: string;
        delay?: number;
        duration?: number;
        easing?: string;
        endDelay?: number;
        fill?: string;
        iterationStart?: number;
        iterations?: number;
        totalTime: number;
    }

    export type AnimationTimeContext = {
        currentTime?: number;
        delta?: number;
        duration?: number;
        offset?: number;
        computedOffset?: number;
        playbackRate?: number;
        target: any;
        targets: any[];
        index: number;
        iterations?: number;
    }
    export interface IAnimator {
        animate(options: ja.AnimationOptions | ja.AnimationOptions[]): ja.IAnimator;
        currentTime(): number;
        currentTime(value: number): IAnimator;
        playbackRate(): number;
        playbackRate(value: number): IAnimator;
        duration(): number;
        playState(): AnimationPlaybackState;
        finish(): IAnimator;
        play(iterations?: number): IAnimator;
        pause(): IAnimator;
        reverse(): IAnimator;
        cancel(): IAnimator; 
        
        onCancel?: AnimationEventListener;
        onCreate?: AnimationEventListener;
        onUpdate?: AnimationEventListener;
        onPause?: AnimationEventListener;
        onPlay?: AnimationEventListener;
        onFinish?: AnimationEventListener;
    }
    
    export interface ITimeline {
        currentTime: number;
        playbackRate: number; 
        duration: number;
        playState: AnimationPlaybackState;
        
        append(options: AnimationOptions | AnimationOptions[]): this;
        finish(): this;
        play(iterations?: number): this; 
        pause(): this;
        reverse(): this;
        cancel(): this;
    }
    
    export type AnimationEventType = 'cancel' | 'pause' | 'play' | 'finish' | 'update' | 'iteration';

    export type AnimationMixin = {
        name: string;
        css?: CssPropertyOptions | CssKeyframeOptions[];
        delay?: Resolvable<number>;
        direction?: Resolvable<string>;
        easing?: string;
        endDelay?: Resolvable<number>;
        fill?: Resolvable<FillMode>;
        iterations?: Resolvable<number>;
        iterationStart?: Resolvable<number>;
        to: number | string;
    }
    export type AnimationEvent = {
        cancel?: AnimationEventListener;
        finish?: AnimationEventListener;
        pause?: AnimationEventListener;
        play?: AnimationEventListener;
        update?: AnimationEventListener;
        iteration?: AnimationEventListener;
        [key: string]: AnimationEventListener;
    }
    export type AnimationEventListener = {
        (ctx: AnimationTimeContext): void;
    }
    export type AnimationOptions = {
        $transition?: boolean;        
        css?: CssPropertyOptions | CssKeyframeOptions[];
        delay?: Resolvable<number>;
        direction?: Resolvable<string>;
        easing?: string;
        endDelay?: Resolvable<number>;
        fill?: Resolvable<FillMode>;
        from?: number | string;
        iterations?: Resolvable<number>;
        iterationStart?: Resolvable<number>;
        mixins?: string | string[];
        targets?: AnimationTarget;
        to: number | string;
        
        onCancel?: AnimationEventListener;
        onCreate?: AnimationEventListener;
        onUpdate?: AnimationEventListener;
        onPause?: AnimationEventListener;
        onPlay?: AnimationEventListener;
        onFinish?: AnimationEventListener;
    }
    export type CssPropertyOptions = {
        backdropFilter?: Resolvable<string | (string)[]>;
        background?: Resolvable<string | (string)[]>;
        backgroundColor?: Resolvable<Color | (Color)[]>;
        backgroundPosition?: Resolvable<string | (string)[]>;
        backgroundSize?: Resolvable<string | (string)[]>;
        border?: Resolvable<string | (string)[]>;
        borderBottom?: Resolvable<string | Distance | (string | Distance)[]>;
        borderBottomColor?: Resolvable<Color | (Color)[]>;
        borderBottomLeftRadius?: Resolvable<Distance | (Distance)[]>;
        borderBottomRightRadius?: Resolvable<Distance | (Distance)[]>;
        borderBottomWidth?: Resolvable<Distance | (Distance)[]>;
        borderColor?: Resolvable<Color | (Color)[]>;
        borderLeft?: Resolvable<string | Distance | (string | Distance)[]>;
        borderLeftColor?: Resolvable<Color | (Color)[]>;
        borderLeftWidth?: Resolvable<Distance | (Distance)[]>;
        borderRadius?: Resolvable<Distance | (Distance)[]>;
        borderRight?: Resolvable<string | Distance | (string | Distance)[]>;
        borderRightColor?: Resolvable<Color | (Color)[]>;
        borderRightWidth?: Resolvable<Distance | (Distance)[]>;
        borderTop?: Resolvable<string | (string)[]>;
        borderTopColor?: Resolvable<Color | (Color)[]>;
        borderTopLeftRadius?: Resolvable<Distance | (Distance)[]>;
        borderTopRightRadius?: Resolvable<Distance | (Distance)[]>;
        borderTopWidth?: Resolvable<Distance | (Distance)[]>;
        borderWidth?: Resolvable<Distance | (Distance)[]>;
        bottom?: Resolvable<string | Distance | (string | Distance)[]>;
        boxShadow?: Resolvable<string | (string)[]>;
        clip?: Resolvable<string | (string)[]>;
        clipPath?: Resolvable<string | (string)[]>;
        color?: Resolvable<Color | (Color)[]>;
        columnCount?: Resolvable<string | (string)[]>;
        columnGap?: Resolvable<string | (string)[]>;
        columnRule?: Resolvable<string | (string)[]>;
        columnRuleColor?: Resolvable<Color | (Color)[]>;
        columnRuleWidth?: Resolvable<Distance | (Distance)[]>;
        columnWidth?: Resolvable<Distance | (Distance)[]>;
        columns?: Resolvable<string | (string)[]>;
        fill?: Resolvable<Color | (Color)[]>;
        fillOpacity?: Resolvable<string | (string)[]>;
        fillRule?: Resolvable<string | (string)[]>;
        filter?: Resolvable<string | (string)[]>;
        flex?: Resolvable<string | (string)[]>;
        flexBasis?: Resolvable<string | (string)[]>;
        flexGrow?: Resolvable<string | (string)[]>;
        flexShrink?: Resolvable<string | (string)[]>;
        font?: Resolvable<string | (string)[]>;
        fontSize?: Resolvable<Distance | (Distance)[]>;
        fontSizeAdjust?: Resolvable<string | (string)[]>;
        fontStretch?: Resolvable<string | (string)[]>;
        fontWeight?: Resolvable<string | (string)[]>;
        gridColumnGap?: Resolvable<string | (string)[]>;
        gridGap?: Resolvable<string | (string)[]>;
        gridRowGap?: Resolvable<string | (string)[]>;
        height?: Resolvable<Distance | (Distance)[]>;
        left?: Resolvable<Distance | (Distance)[]>;
        letterSpacing?: Resolvable<Distance | (Distance)[]>;
        lineHeight?: Resolvable<Distance | (Distance)[]>;
        margin?: Resolvable<Distance | (Distance)[]>;
        marginBottom?: Resolvable<Distance | (Distance)[]>;
        marginLeft?: Resolvable<Distance | (Distance)[]>;
        marginRight?: Resolvable<Distance | (Distance)[]>;
        marginTop?: Resolvable<Distance | (Distance)[]>;
        mask?: Resolvable<string | (string)[]>;
        maskPosition?: Resolvable<string | (string)[]>;
        maskSize?: Resolvable<string | (string)[]>;
        maxHeight?: Resolvable<Distance | (Distance)[]>;
        maxWidth?: Resolvable<Distance | (Distance)[]>;
        minHeight?: Resolvable<Distance | (Distance)[]>;
        minWidth?: Resolvable<Distance | (Distance)[]>;
        motionOffset?: Resolvable<Distance | (Distance)[]>;
        motionRotation?: Resolvable<Angle | (Angle)[]>;
        objectPosition?: Resolvable<Distance | (Distance)[]>;
        opacity?: Resolvable<number | (number)[]>;
        order?: Resolvable<number | (number)[]>;
        outline?: Resolvable<string | (string)[]>;
        outlineColor?: Resolvable<Color | (Color)[]>;
        outlineOffset?: Resolvable<string | (string)[]>;
        outlineWidth?: Resolvable<string | (string)[]>;
        padding?: Resolvable<Distance | (Distance)[]>;
        paddingBottom?: Resolvable<Distance | (Distance)[]>;
        paddingLeft?: Resolvable<Distance | (Distance)[]>;
        paddingRight?: Resolvable<Distance | (Distance)[]>;
        paddingTop?: Resolvable<Distance | (Distance)[]>;
        perspective?: Resolvable<string | (string)[]>;
        perspectiveOrigin?: Resolvable<string | (string)[]>;
        right?: Resolvable<Distance | (Distance)[]>;
        rotateX?: Resolvable<Angle | (Angle)[]>;
        rotateY?: Resolvable<Angle | (Angle)[]>;
        rotateZ?: Resolvable<Angle | (Angle)[]>;
        scale?: Resolvable<Distance | (Distance)[]>;
        scaleX?: Resolvable<Distance | (Distance)[]>;
        scaleY?: Resolvable<Distance | (Distance)[]>;
        scaleZ?: Resolvable<Distance | (Distance)[]>;
        scrollSnapCoordinate?: Resolvable<string | (string)[]>;
        scrollSnapDestination?: Resolvable<string | (string)[]>;
        skewX?: Resolvable<Distance | (Distance)[]>;
        skewY?: Resolvable<Distance | (Distance)[]>;
        shapeImageThreshold?: Resolvable<string | (string)[]>;
        shapeMargin?: Resolvable<string | (string)[]>;
        shapeOutside?: Resolvable<string | (string)[]>;
        stroke?: Resolvable<Color | (Color)[]>;
        strokeDasharray?: Resolvable<string | (string)[]>;
        strokeDashoffset?: Resolvable<string | (string)[]>;
        strokeLinecap?: Resolvable<string | (string)[]>;
        strokeLinejoin?: Resolvable<string | (string)[]>;
        strokeMiterlimit?: Resolvable<string | (string)[]>;
        strokeOpacity?: Resolvable<number | (number)[]>;
        strokeWidth?: Resolvable<string | (string)[]>;
        textDecoration?: Resolvable<string | (string)[]>;
        textDecorationColor?: Resolvable<Color | (Color)[]>;
        textEmphasis?: Resolvable<string | (string)[]>;
        textEmphasisColor?: Resolvable<Color | (Color)[]>;
        textIndent?: Resolvable<string | (string)[]>;
        textShadow?: Resolvable<string | (string)[]>;
        top?: Resolvable<Distance | (Distance)[]>;
        transform?: Resolvable<string | (string)[]>;
        transformOrigin?: Resolvable<string | (string)[]>;
        transformPerspective?: Resolvable<string | number | (string | number)[]>;
        x?: Resolvable<Distance | (Distance)[]>;
        translateX?: Resolvable<Distance | (Distance)[]>;
        y?: Resolvable<Distance | (Distance)[]>;
        translateY?: Resolvable<Distance | (Distance)[]>;
        z?: Resolvable<Distance | (Distance)[]>;
        translateZ?: Resolvable<Distance | (Distance)[]>;
        verticalAlign?: Resolvable<string | (string)[]>;
        visibility?: Resolvable<string | (string)[]>;
        width?: Resolvable<string | number | (string | number)[]>;
        wordSpacing?: Resolvable<string | (string)[]>;
        zIndex?: Resolvable<number | (number)[]>;
    }
    export type CssKeyframeOptions = {
        offset?: number | number[];
        easing?: Resolvable<string>;
        backdropFilter?: Resolvable<string>;
        background?: Resolvable<string>;
        backgroundColor?: Resolvable<Color>;
        backgroundPosition?: Resolvable<string>;
        backgroundSize?: Resolvable<string>;
        border?: Resolvable<string>;
        borderBottom?: Resolvable<string | Distance>;
        borderBottomColor?: Resolvable<Color>;
        borderBottomLeftRadius?: Resolvable<Distance>;
        borderBottomRightRadius?: Resolvable<Distance>;
        borderBottomWidth?: Resolvable<Distance>;
        borderColor?: Resolvable<Color>;
        borderLeft?: Resolvable<string | Distance>;
        borderLeftColor?: Resolvable<Color>;
        borderLeftWidth?: Resolvable<Distance>;
        borderRadius?: Resolvable<Distance>;
        borderRight?: Resolvable<string | Distance>;
        borderRightColor?: Resolvable<Color>;
        borderRightWidth?: Resolvable<Distance>;
        borderTop?: Resolvable<string>;
        borderTopColor?: Resolvable<Color>;
        borderTopLeftRadius?: Resolvable<Distance>;
        borderTopRightRadius?: Resolvable<Distance>;
        borderTopWidth?: Resolvable<Distance>;
        borderWidth?: Resolvable<Distance>;
        bottom?: Resolvable<string | Distance>;
        boxShadow?: Resolvable<string>;
        clip?: Resolvable<string>;
        clipPath?: Resolvable<string>;
        color?: Resolvable<Color>;
        columnCount?: Resolvable<string>;
        columnGap?: Resolvable<string>;
        columnRule?: Resolvable<string>;
        columnRuleColor?: Resolvable<Color>;
        columnRuleWidth?: Resolvable<Distance>;
        columnWidth?: Resolvable<Distance>;
        columns?: Resolvable<string>;
        fill?: Resolvable<Color>;
        fillOpacity?: Resolvable<string>;
        fillRule?: Resolvable<string>;
        filter?: Resolvable<string>;
        flex?: Resolvable<string>;
        flexBasis?: Resolvable<string>;
        flexGrow?: Resolvable<string>;
        flexShrink?: Resolvable<string>;
        font?: Resolvable<string>;
        fontSize?: Resolvable<Distance>;
        fontSizeAdjust?: Resolvable<string>;
        fontStretch?: Resolvable<string>;
        fontWeight?: Resolvable<string>;
        gridColumnGap?: Resolvable<string>;
        gridGap?: Resolvable<string>;
        gridRowGap?: Resolvable<string>;
        height?: Resolvable<Distance>;
        left?: Resolvable<Distance>;
        letterSpacing?: Resolvable<Distance>;
        lineHeight?: Resolvable<Distance>;
        margin?: Resolvable<Distance>;
        marginBottom?: Resolvable<Distance>;
        marginLeft?: Resolvable<Distance>;
        marginRight?: Resolvable<Distance>;
        marginTop?: Resolvable<Distance>;
        mask?: Resolvable<string>;
        maskPosition?: Resolvable<string>;
        maskSize?: Resolvable<string>;
        maxHeight?: Resolvable<Distance>;
        maxWidth?: Resolvable<Distance>;
        minHeight?: Resolvable<Distance>;
        minWidth?: Resolvable<Distance>;
        motionOffset?: Resolvable<Distance>;
        motionRotation?: Resolvable<Angle>;
        objectPosition?: Resolvable<Distance>;
        opacity?: Resolvable<number>;
        order?: Resolvable<number>;
        outline?: Resolvable<string>;
        outlineColor?: Resolvable<Color>;
        outlineOffset?: Resolvable<string>;
        outlineWidth?: Resolvable<string>;
        padding?: Resolvable<string | Distance>;
        paddingBottom?: Resolvable<Distance>;
        paddingLeft?: Resolvable<Distance>;
        paddingRight?: Resolvable<Distance>;
        paddingTop?: Resolvable<Distance>;
        perspective?: Resolvable<string>;
        perspectiveOrigin?: Resolvable<string>;
        right?: Resolvable<Distance>;
        rotateX?: Resolvable<Angle>;
        rotateY?: Resolvable<Angle>;
        rotateZ?: Resolvable<Angle>;
        scale?: Resolvable<Distance>;
        scaleX?: Resolvable<Distance>;
        scaleY?: Resolvable<Distance>;
        scaleZ?: Resolvable<Distance>;
        scrollSnapCoordinate?: Resolvable<string>;
        scrollSnapDestination?: Resolvable<string>;
        skewX?: Resolvable<Distance>;
        skewY?: Resolvable<Distance>;
        shapeImageThreshold?: Resolvable<string>;
        shapeMargin?: Resolvable<string>;
        shapeOutside?: Resolvable<string>;
        stroke?: Resolvable<Color>;
        strokeDasharray?: Resolvable<string>;
        strokeDashoffset?: Resolvable<string>;
        strokeLinecap?: Resolvable<string>;
        strokeLinejoin?: Resolvable<string>;
        strokeMiterlimit?: Resolvable<string>;
        strokeOpacity?: Resolvable<number>;
        strokeWidth?: Resolvable<string>;
        textDecoration?: Resolvable<string>;
        textDecorationColor?: Resolvable<Color>;
        textEmphasis?: Resolvable<string>;
        textEmphasisColor?: Resolvable<Color>;
        textIndent?: Resolvable<string>;
        textShadow?: Resolvable<string>;
        top?: Resolvable<Distance>;
        transform?: Resolvable<string>;
        transformOrigin?: Resolvable<string>;
        transformPerspective?: Resolvable<string | number>;
        x?: Resolvable<Distance>;
        translateX?: Resolvable<Distance>;
        y?: Resolvable<Distance>;
        translateY?: Resolvable<Distance>;
        z?: Resolvable<Distance>;
        translateZ?: Resolvable<Distance>;
        verticalAlign?: Resolvable<string>;
        visibility?: Resolvable<string>;
        width?: Resolvable<string | number>;
        wordSpacing?: Resolvable<string>;
        zIndex?: Resolvable<number>;
    }

    export type SplitTextResult = {
        words: Element[];
        characters: Element[];
    }
    export type AnimationTargetContext = {
        options?: ja.AnimationOptions;
        target?: AnimationTarget;
        index?: number;
        targets?: AnimationTarget[]
    }
    export type Mapper<T1, T2> = {
        (mapable: T1): T2;
    }
    export type Func<T1> = {
        (mapable: T1): T1;
    }
    export type Resolver<T> = {
        (ctx: AnimationTargetContext): T;
    }
}
