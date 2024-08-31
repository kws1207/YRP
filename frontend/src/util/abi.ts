//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildABIMap(abiList: any[]) {
  const abiMap = abiList.reduce((accum, abi) => {
    const key = abi.name;

    accum[key] = abi;

    return accum;
  }, {});

  return abiMap;
}
