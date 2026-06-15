/* =============================================
   ui.js — UI Controller
   ============================================= */

let currentMode = 'enkripsi';
let stepsVisible = false;

function setMode(m) {
  currentMode = m;
  document.getElementById('btnEnkripsi').classList.toggle('active', m === 'enkripsi');
  document.getElementById('btnDekripsi').classList.toggle('active', m === 'dekripsi');
}

function reset() {
  document.getElementById('inputBits').value = '';
  document.getElementById('keyBits').value = '';
  document.getElementById('inputNote').textContent = '';
  document.getElementById('inputNote').className = 'field-note';
  document.getElementById('keyNote').textContent = '';
  document.getElementById('keyNote').className = 'field-note';
  document.getElementById('outputCard').style.display = 'none';
  stepsVisible = false;
}

function toggleSteps() {
  stepsVisible = !stepsVisible;
  document.getElementById('stepsPanel').style.display = stepsVisible ? 'block' : 'none';
  document.getElementById('toggleLabel').textContent = stepsVisible
    ? '▼ Sembunyikan Langkah Perhitungan'
    : '▶ Tampilkan Langkah Perhitungan';
}

// ---- Validasi ----
function validate() {
  const inp = document.getElementById('inputBits').value.trim();
  const key = document.getElementById('keyBits').value.trim();
  let ok = true;

  const inpNote = document.getElementById('inputNote');
  if (!/^[01]{8}$/.test(inp)) {
    inpNote.textContent = '✗ Harus tepat 8 bit (0 dan 1 saja)';
    inpNote.className = 'field-note';
    ok = false;
  } else {
    inpNote.textContent = '✓ Valid';
    inpNote.className = 'field-note ok';
  }

  const keyNote = document.getElementById('keyNote');
  if (!/^[01]{10}$/.test(key)) {
    keyNote.textContent = '✗ Harus tepat 10 bit (0 dan 1 saja)';
    keyNote.className = 'field-note';
    ok = false;
  } else {
    keyNote.textContent = '✓ Valid';
    keyNote.className = 'field-note ok';
  }

  return ok ? { inp, key } : null;
}

function proses() {
  const valid = validate();
  if (!valid) return;

  const input8 = valid.inp.split('').map(Number);
  const key10  = valid.key.split('').map(Number);

  const result = sdes(input8, key10, currentMode);

  // Tampilkan output
  document.getElementById('outputCard').style.display = 'block';
  document.getElementById('resultLabel').textContent =
    currentMode === 'enkripsi' ? 'Ciphertext (Output Enkripsi)' : 'Plaintext (Output Dekripsi)';

  renderBitRow('resultBits', result.output, true);
  renderSteps(result, input8, key10);

  // Scroll ke output
  document.getElementById('outputCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Render bit row ----
function renderBitRow(containerId, bits, large) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  bits.forEach((b, i) => {
    const cell = document.createElement('div');
    cell.className = 'bit-cell' + (b ? ' one' : '');
    cell.innerHTML = `${b}<span class="pos">${i+1}</span>`;
    el.appendChild(cell);
  });
}

// ---- Render step bits ----
function stepBits(bits, colorOne) {
  return bits.map((b, i) => {
    let cls = 'step-bit';
    if (b && colorOne === 'blue') cls += ' blue-one';
    else if (b) cls += ' one';
    return `<div class="${cls}">${b}</div>`;
  }).join('');
}

function stepBitsHtml(bits, colorOne) {
  return `<div class="step-bits">${stepBits(bits, colorOne)}</div>`;
}

function splitBitsHtml(left, right, labelL, labelR) {
  return `
    <div class="sub-row">
      <div class="sub-col">
        <div class="sub-label">${labelL}</div>
        ${stepBitsHtml(left)}
      </div>
      <div class="sub-col">
        <div class="sub-label">${labelR}</div>
        ${stepBitsHtml(right)}
      </div>
    </div>`;
}

function sboxTableHtml(box, boxName, rowSel, colSel, resultBits) {
  const cols = ['Col 0','Col 1','Col 2','Col 3'];
  let html = `<table class="sbox-table"><thead><tr><th>${boxName}</th>`;
  cols.forEach(c => html += `<th>${c}</th>`);
  html += '</tr></thead><tbody>';
  box.forEach((row, r) => {
    html += '<tr>';
    html += `<th>Row ${r}</th>`;
    row.forEach((val, c) => {
      const hi = (r === rowSel && c === colSel) ? ' highlight-cell' : '';
      html += `<td class="${hi}">${val} (${val.toString(2).padStart(2,'0')})</td>`;
    });
    html += '</tr>';
  });
  html += `</tbody></table>
  <div style="margin-top:6px;font-size:12px;color:var(--ink-muted);font-family:var(--mono);">
    Row = bit ke-1 &amp; ke-4 = <b>${rowSel}</b>, Col = bit ke-2 &amp; ke-3 = <b>${colSel}</b>
    → <b>${box[rowSel][colSel]}</b> = <b>${resultBits.join('')}</b>
  </div>`;
  return html;
}

// ---- Render All Steps ----
function renderSteps(r, input8, key10) {
  const mode = currentMode;
  let html = '';

  // ============ KEY GENERATION ============
  html += `<div class="step-group">`;
  html += `<div class="step-group-title">A. Pembangkitan Kunci (Key Generation)</div>`;

  html += stepBlock('Input Kunci (10 bit)', stepBitsHtml(key10), '');

  html += stepBlock('P10 — Permutasi awal kunci',
    stepBitsHtml(r.keyGen.p10),
    `Tabel P10: [3,5,2,7,4,10,1,9,8,6]`);

  html += stepBlock('Bagi Kiri &amp; Kanan (masing-masing 5 bit)',
    splitBitsHtml(r.keyGen.split0.left, r.keyGen.split0.right, 'Kiri (L)', 'Kanan (R)'), '');

  html += stepBlock('LS-1 — Left Shift 1 bit',
    splitBitsHtml(r.keyGen.ls1.left, r.keyGen.ls1.right, 'L setelah LS-1', 'R setelah LS-1'), '');

  html += stepBlock('K1 — Permutasi P8 dari hasil LS-1',
    stepBitsHtml(r.keyGen.k1, 'blue'),
    `Tabel P8: [6,3,7,4,8,5,10,9]`, 'highlight');

  html += stepBlock('LS-2 — Left Shift 2 bit tambahan',
    splitBitsHtml(r.keyGen.ls2.left, r.keyGen.ls2.right, 'L setelah LS-2', 'R setelah LS-2'), '');

  html += stepBlock('K2 — Permutasi P8 dari hasil LS-2',
    stepBitsHtml(r.keyGen.k2, 'blue'),
    `Tabel P8: [6,3,7,4,8,5,10,9]`, 'highlight');

  html += `</div>`;

  // ============ ENKRIPSI / DEKRIPSI ============
  const modeLabel = mode === 'enkripsi' ? 'Enkripsi' : 'Dekripsi';
  html += `<div class="step-group">`;
  html += `<div class="step-group-title">B. Proses ${modeLabel}</div>`;

  html += stepBlock(`Input (${mode === 'enkripsi' ? 'Plaintext' : 'Ciphertext'} 8 bit)`,
    stepBitsHtml(input8), '');

  html += stepBlock('IP — Initial Permutation',
    stepBitsHtml(r.ip),
    'Tabel IP: [2,6,3,1,4,8,5,7]');

  html += stepBlock('Bagi Hasil IP menjadi L dan R (4 bit)',
    splitBitsHtml(r.ipSplit.left, r.ipSplit.right, 'L (kiri)', 'R (kanan)'), '');

  html += `</div>`;

  // ---- ROUND 1 ----
  const k1label = mode === 'enkripsi' ? 'K1' : 'K2';
  const k2label = mode === 'enkripsi' ? 'K2' : 'K1';
  const keyUsed1 = mode === 'enkripsi' ? r.keyGen.k1 : r.keyGen.k2;
  const keyUsed2 = mode === 'enkripsi' ? r.keyGen.k2 : r.keyGen.k1;

  html += `<div class="step-group">`;
  html += `<div class="step-group-title">C. Round Function 1 (menggunakan ${k1label})</div>`;
  html += roundSteps(r.round1, r.ipSplit.right, keyUsed1, k1label, r.afterR1);
  html += `</div>`;

  // ---- SWAP ----
  html += `<div class="step-group">`;
  html += `<div class="step-group-title">D. SW — Swap</div>`;
  html += stepBlock('Tukar kiri dan kanan',
    splitBitsHtml(r.swap.after.left, r.swap.after.right,
      'Kiri baru (= R lama)', 'Kanan baru (= newL lama)'), '');
  html += `</div>`;

  // ---- ROUND 2 ----
  html += `<div class="step-group">`;
  html += `<div class="step-group-title">E. Round Function 2 (menggunakan ${k2label})</div>`;
  html += roundSteps(r.round2, r.swap.after.right, keyUsed2, k2label, {
    left: r.preIP1.slice(0,4), right: r.preIP1.slice(4)
  });
  html += `</div>`;

  // ---- IP-1 ----
  html += `<div class="step-group">`;
  html += `<div class="step-group-title">F. Output Akhir</div>`;

  html += stepBlock('Gabungkan kiri dan kanan sebelum IP⁻¹',
    stepBitsHtml(r.preIP1), '');

  html += stepBlock('IP⁻¹ — Inverse Initial Permutation',
    stepBitsHtml(r.output, 'blue'),
    'Tabel IP⁻¹: [4,1,3,5,7,2,8,6]', 'success');

  html += `</div>`;

  document.getElementById('stepsContent').innerHTML = html;
}

function roundSteps(rnd, rightIn, keyBits, keyLabel, after) {
  let html = '';

  html += stepBlock(`EP — Expansion Permutation (4 bit → 8 bit)`,
    stepBitsHtml(rnd.ep),
    'Tabel EP: [4,1,2,3,2,3,4,1]');

  html += stepBlock(`XOR dengan ${keyLabel}`,
    `<div class="sub-row">
      <div class="sub-col"><div class="sub-label">Hasil EP</div>${stepBitsHtml(rnd.ep)}</div>
      <div class="sub-col"><div class="sub-label">${keyLabel}</div>${stepBitsHtml(keyBits, 'blue')}</div>
      <div class="sub-col"><div class="sub-label">XOR</div>${stepBitsHtml(rnd.xorKey)}</div>
    </div>`, '');

  html += stepBlock('Bagi hasil XOR menjadi 2 x 4 bit',
    splitBitsHtml(rnd.xorSplit.left, rnd.xorSplit.right, 'Bagian Kiri (→ S0)', 'Bagian Kanan (→ S1)'), '');

  // S0
  html += stepBlock('S-Box S0',
    `${stepBitsHtml(rnd.s0.bits)}
     ${sboxTableHtml(S0, 'S0', rnd.s0.row, rnd.s0.col, rnd.s0.result)}`, '');

  // S1
  html += stepBlock('S-Box S1',
    `${stepBitsHtml(rnd.s1.bits)}
     ${sboxTableHtml(S1, 'S1', rnd.s1.row, rnd.s1.col, rnd.s1.result)}`, '');

  html += stepBlock('Gabungkan output S0 &amp; S1',
    stepBitsHtml(rnd.sboxOut), '');

  html += stepBlock('P4 — Permutasi 4 bit',
    stepBitsHtml(rnd.p4),
    'Tabel P4: [2,4,3,1]');

  html += stepBlock('XOR P4 dengan bagian kiri IP',
    `<div class="sub-row">
      <div class="sub-col"><div class="sub-label">P4</div>${stepBitsHtml(rnd.p4)}</div>
      <div class="sub-col"><div class="sub-label">Kiri lama</div>${stepBitsHtml(rnd.newLeft)}</div>
      <div class="sub-col"><div class="sub-label">Hasil XOR (kiri baru)</div>${stepBitsHtml(rnd.newLeft)}</div>
    </div>`, '');

  return html;
}

function stepBlock(label, bodyHtml, noteText, variant) {
  const cls = variant === 'highlight' ? ' highlight' : variant === 'success' ? ' success' : '';
  let html = `<div class="step-block${cls}">`;
  html += `<div class="step-label">${label}</div>`;
  html += bodyHtml;
  if (noteText) html += `<div style="font-size:11px;color:var(--ink-muted);margin-top:8px;font-family:var(--mono);">${noteText}</div>`;
  html += `</div>`;
  return html;
}

// ---- Live Validation ----
document.getElementById('inputBits').addEventListener('input', function() {
  this.value = this.value.replace(/[^01]/g, '').slice(0, 8);
});
document.getElementById('keyBits').addEventListener('input', function() {
  this.value = this.value.replace(/[^01]/g, '').slice(0, 10);
});
