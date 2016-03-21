export type FillMode = "none" | "forwards" | "backwards" | "both" | "auto";
//export type PlaybackDiraction = "normal" | "reverse" | "alternate" | "alternate-reverse";

export interface IAnimationEffectTiming {
    // delay?: number;
    // direction?: PlaybackDiraction;
    duration?: number;
    easing?: string;
    // endDelay?: number;
    fill?:  FillMode;
    // iterationStart?: number;
    iterations?: number;
}