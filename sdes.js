/* =============================================
   sdes.js — Core S-DES Algorithm
   ============================================= */

// ---- Tabel Permutasi ----
const P10 = [3,5,2,7,4,10,1,9,8,6];
const P8  = [6,3,7,4,8,5,10,9];
const IP  = [2,6,3,1,4,8,5,7];
const IP1 = [4,1,3,5,7,2,8,6];
const EP  = [4,1,2,3,2,3,4,1];
const P4  = [2,4,3,1];

// S-Box S0 dan S1
const S0 = [
  [1,0,3,2],
  [3,2,1,0],
  [0,2,1,3],
  [3,1,3,2]
];
const S1 = [
  [0,1,2,3],
  [2,0,1,3],
  [3,0,1,0],
  [2,1,0,3]
];

// ---- Helper ----
function permute(bits, table) {
  return table.map(i => bits[i - 1]);
}

function xor(a, b) {
  return a.map((bit, i) => bit ^ b[i]);
}

function leftShift(bits, n) {
  return [...bits.slice(n), ...bits.slice(0, n)];
}

function toBin2(val) {
  return [(val >> 1) & 1, val & 1];
}

function sbox(bits, box) {
  const row = (bits[0] << 1) | bits[3];
  const col = (bits[1] << 1) | bits[2];
  return { result: toBin2(box[row][col]), row, col };
}

// ---- Key Generation ----
function generateKeys(key10) {
  const steps = {};

  // P10
  const p10 = permute(key10, P10);
  steps.p10 = [...p10];

  // Split
  const left0  = p10.slice(0, 5);
  const right0 = p10.slice(5);
  steps.split0 = { left: [...left0], right: [...right0] };

  // LS-1
  const ls1L = leftShift(left0, 1);
  const ls1R = leftShift(right0, 1);
  steps.ls1 = { left: [...ls1L], right: [...ls1R] };

  // K1
  const K1 = permute([...ls1L, ...ls1R], P8);
  steps.k1 = [...K1];

  // LS-2 (shift 2 more pada hasil LS-1)
  const ls2L = leftShift(ls1L, 2);
  const ls2R = leftShift(ls1R, 2);
  steps.ls2 = { left: [...ls2L], right: [...ls2R] };

  // K2
  const K2 = permute([...ls2L, ...ls2R], P8);
  steps.k2 = [...K2];

  return { K1, K2, steps };
}

// ---- Round Function ----
function roundFunction(left4, right4, key8, roundNum) {
  const log = {};

  // EP: ekspansi 4-bit → 8-bit
  const ep = permute(right4, EP);
  log.ep = [...ep];

  // XOR dengan subkunci
  const xorKey = xor(ep, key8);
  log.xorKey = [...xorKey];
  log.key = [...key8];

  // Bagi 2 x 4-bit
  const xorL = xorKey.slice(0, 4);
  const xorR = xorKey.slice(4);
  log.xorSplit = { left: [...xorL], right: [...xorR] };

  // S-Box
  const s0res = sbox(xorL, S0);
  const s1res = sbox(xorR, S1);
  log.s0 = { bits: [...xorL], result: s0res.result, row: s0res.row, col: s0res.col };
  log.s1 = { bits: [...xorR], result: s1res.result, row: s1res.row, col: s1res.col };

  // Gabungkan → P4
  const combined = [...s0res.result, ...s1res.result];
  log.sboxOut = [...combined];

  const p4out = permute(combined, P4);
  log.p4 = [...p4out];

  // XOR dengan bagian kiri
  const newLeft = xor(p4out, left4);
  log.newLeft = [...newLeft];

  // Swap: kanan (right4) jadi kiri baru, newLeft jadi kanan baru
  // Return new left = right4 (asli), new right = newLeft
  return { newLeft: right4, newRight: newLeft, log };
}

// ---- Enkripsi / Dekripsi ----
function sdes(input8, key10, mode) {
  const result = {};

  // Generate keys
  const { K1, K2, steps: keySteps } = generateKeys(key10);
  result.keyGen = keySteps;

  // IP
  const ip = permute(input8, IP);
  result.ip = [...ip];

  let left  = ip.slice(0, 4);
  let right = ip.slice(4);
  result.ipSplit = { left: [...left], right: [...right] };

  // Round 1: enkripsi pakai K1, dekripsi pakai K2
  const key1 = mode === 'enkripsi' ? K1 : K2;
  const key2 = mode === 'enkripsi' ? K2 : K1;

  const r1 = roundFunction(left, right, key1, 1);
  result.round1 = r1.log;
  result.afterR1 = {
    left:  [...r1.newLeft],
    right: [...r1.newRight]
  };

  // SW (Swap)
  result.swap = {
    before: { left: [...r1.newLeft], right: [...r1.newRight] },
    after:  { left: [...r1.newRight], right: [...r1.newLeft] }
  };

  // Round 2
  const r2 = roundFunction(r1.newRight, r1.newLeft, key2, 2);
  result.round2 = r2.log;

  const preIP1 = [...r2.newLeft, ...r2.newRight];
  result.preIP1 = [...preIP1];

  // IP-1
  const output = permute(preIP1, IP1);
  result.output = [...output];

  return result;
}
