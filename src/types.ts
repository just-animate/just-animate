export * from './types/base';
export * from './types/waapi';

declare global { 
    export interface Window {
        JA: JustAnimateStatic;
    }    
}

/** 
 * Static instance of Just Animate
 * This contains all helpers and Timeline
 */
export interface JustAnimateStatic {
    
}
