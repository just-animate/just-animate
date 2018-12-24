import {
  JustAnimatePlugin,
  Effect,
  AnimationController
} from '../lib/core/types';
import { interpolator } from '../lib/core/interpolate';
import { _ } from '../lib/utils/constants';
import { isDOM } from '../lib/utils/inspect';
import { hyphenate } from '../lib/utils/strings';
import { includes } from '../lib/utils/lists';

const PROPERTY = 0;
const ATTRIBUTE = 1;
const ATTRIBUTE_HYPHENATE = 2;
const CSSVAR = 3;

const cssVarExp = /^\-\-[a-z0-9\-]+$/i;
const viewbox = 'viewBox';
const svgReadonly = [viewbox];
const noHyphenate = [viewbox];

export const propsPlugin: JustAnimatePlugin = {
  name: 'props',
  animate(effect: Effect): AnimationController {
    const { target, prop } = effect;
    const interpolate = interpolator(effect.to - effect.from, effect.keyframes);
    const propSetter = getTargetSetter(target, prop);
    const propGetter = getTargetGetter(target, prop);

    let initial: any = _;

    return {
      cancel(): void {
        if (initial !== _) {
          propSetter(initial);
        }
        initial = _;
      },
      update(
        localTime: number,
        _playbackRate: number,
        _isActive: boolean
      ): void {
        if (initial === _) {
          initial = propGetter();
        }

        propSetter(interpolate(localTime));
      }
    };
  },
  getValue(target: HTMLElement, prop: string) {
    return getTargetGetter(target, prop)();
  }
};

function getTargetType(target: any, prop: string) {
  // ignore attribute and variable setters if is not DOM or if the
  // target has a property with that exact name

  if (!isDOM(target)) {
    return PROPERTY;
  }
  if (cssVarExp.test(prop)) {
    return CSSVAR;
  }
  if (typeof target[prop] !== 'undefined' && !includes(svgReadonly, prop)) {
    return PROPERTY;
  }
  if (includes(noHyphenate, prop)) {
    return ATTRIBUTE;
  }
  return ATTRIBUTE_HYPHENATE;
}

function getTargetGetter(target: any, prop: string) {
  const targetType = getTargetType(target, prop);

  return targetType === CSSVAR
    ? getVariable(target, prop)
    : targetType === ATTRIBUTE
    ? getAttribute(target, prop)
    : targetType === ATTRIBUTE_HYPHENATE
    ? getAttributeHyphenate(target, prop)
    : getProperty(target, prop);
}

function getTargetSetter(target: any, prop: string) {
  const targetType = getTargetType(target, prop);

  return targetType === CSSVAR
    ? setVariable(target, prop)
    : targetType === ATTRIBUTE
    ? setAttribute(target, prop)
    : targetType === ATTRIBUTE_HYPHENATE
    ? setAttributeHyphenate(target, prop)
    : setProperty(target, prop);
}

function getAttribute(target: HTMLElement, name: string) {
  return () => target.getAttribute(name);
}

function setAttribute(target: HTMLElement, name: string) {
  return (value: any) => target.setAttribute(name, value);
}

function setAttributeHyphenate(target: HTMLElement, name: string) {
  const attName = hyphenate(name);
  return (value: any) => target.setAttribute(attName, value);
}

function getAttributeHyphenate(target: HTMLElement, name: string) {
  const attName = hyphenate(name);
  return () => target.getAttribute(attName);
}

function getVariable(target: HTMLElement, name: string) {
  return () => target.style.getPropertyValue(name);
}

function setVariable(target: HTMLElement, name: string) {
  return (value: any) =>
    target.style.setProperty(name, value ? value + '' : '');
}

function setProperty(target: {}, name: string) {
  return (value: any) => (target[name] = value);
}

function getProperty(target: {}, name: string) {
  return () => target[name];
}
