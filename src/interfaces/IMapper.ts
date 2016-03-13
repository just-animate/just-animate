export interface IMapper<T1, T2> {
    (mapable: T1): T2;
}
