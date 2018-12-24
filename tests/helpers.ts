export function toMatrix(transform1: string) {
  const el = document.createElement('div');
  el.style.transform = transform1;
  document.body.appendChild(el);
  const result = el.style.transform;
  document.body.removeChild(el);
  return result;
}

export function dump(obj: any) {
  console.log(
    JSON.stringify(
      obj,
      (_, v) => {
        if (v === undefined) {
          // tslint:disable-next-line:no-null-keyword
          return null;
        }
        if (typeof v === 'function') {
          return v.name + '()';
        }
        return v;
      },
      4
    )
  );
}
