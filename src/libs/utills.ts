export function reshape(cds: Array<any>, rem: number) {
  let arr: Array<any> = [];
  let cds_cnt = 0;
  while (cds_cnt < cds.length) {
    if (cds_cnt % rem == 0) {
      arr = [...arr, []];
    }
    let quo = Math.floor(cds_cnt / 5);
    let irem = cds_cnt % rem;
    arr[quo] = [...arr[quo], cds[cds_cnt]];
    cds_cnt++;
  }
  return arr;
}
