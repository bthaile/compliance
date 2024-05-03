const Picker = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const ret: any = {};
  keys.forEach(key => {
    // eslint-disable-next-line
    ret[key] = obj[key];
  })
  // eslint-disable-next-line
  return ret;
}

export default Picker;