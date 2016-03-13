import {IIndexed} from './IIndexed';

export type ElementSource = Element | IIndexed<Element> | NodeList | string | IElementProvider;

export interface IElementProvider {
    (): Element | IIndexed<Element> | NodeList;
}