export interface IIndexed<T> {
    [index: number]: T;
    length: number;
}