const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
const tr = {};
for (let i = 0; i < 58; i++) {
    tr[table[i]] = i;
}
const s = [11, 10, 3, 8, 4, 6];
const xor = 177451812,
    add = 8728348608;


function bv2av(x) {
  let r = 0
  for (let i = 0; i < 6; i++) {
    r += tr[x[s[i]]] * Math.pow(58, i)
  }
  return (r - add) ^ xor
}

export function getAid(bvid) {
  if (bvid.includes('BV')) {
    return bv2av(bvid)
  } else {
    return bvid
  }
}


