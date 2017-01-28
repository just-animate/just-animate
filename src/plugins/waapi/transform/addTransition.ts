import { isDefined, listProps } from '../../../common';
import { Keyframe } from '../waapi';
import { transforms } from './resources';

export const addTransition = (keyframes: Keyframe[], target: HTMLElement): void => {
    // detect properties to transition
    const properties = listProps(keyframes);

    // copy properties from the dom to the animation
    // todo: check how to do this in IE8, or not?
    const style = window.getComputedStyle(target);

    // create the first frame
    const firstFrame: Keyframe = { offset: 0 };
    keyframes.splice(0, 0, firstFrame);

    properties.forEach((property: string) => {
        // skip offset property
        if (property === 'offset') {
            return;
        }

        const alias = transforms.indexOf(property) !== -1 ? 'transform' : property;
        const val = style[alias];

        if (isDefined(val)) {
            firstFrame[alias] = val;
        }
    });
};
