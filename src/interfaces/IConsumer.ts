export interface IConsumer<T1> {
    (consumable: T1): any;
}
