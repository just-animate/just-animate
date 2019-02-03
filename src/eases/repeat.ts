export function repeat(times?: number) {
  times = +(times || times === 0 ? times : 2);
  return (o: number) => {
    o = o * times!;
    return o === times ? 1 : o - ~~o;
  };
}
