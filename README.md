# 🔐 S-DES Simulator

> Simulasi interaktif algoritma **Simplified Data Encryption Standard (S-DES)** berbasis web menggunakan **HTML, CSS, dan JavaScript**, dilengkapi visualisasi langkah-langkah enkripsi dan dekripsi secara detail untuk keperluan pembelajaran kriptografi.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-5-E34F26?logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-3-1572B6?logo=css3\&logoColor=white)

---

## ✨ Fitur Utama

### 🔒 Enkripsi & Dekripsi S-DES

* Mendukung proses **enkripsi** dan **dekripsi** menggunakan algoritma Simplified DES.
* Input berupa:

  * Plaintext/Ciphertext 8-bit
  * Kunci (Key) 10-bit
* Validasi input biner secara otomatis.

### 📊 Visualisasi Langkah Perhitungan

Menampilkan seluruh proses algoritma S-DES secara detail:

#### Key Generation

* Permutasi P10
* Left Shift 1 (LS-1)
* Pembentukan Subkey K1
* Left Shift 2 (LS-2)
* Pembentukan Subkey K2

#### Initial Permutation (IP)

* Permutasi awal plaintext/ciphertext.

#### Round Function

Untuk setiap round:

* Expansion Permutation (EP)
* XOR dengan subkey
* Substitusi menggunakan S-Box S0 dan S1
* Permutasi P4
* XOR dengan bagian kiri

#### Swap Function

* Pertukaran blok kiri dan kanan setelah round pertama.

#### Inverse Permutation (IP⁻¹)

* Menghasilkan ciphertext atau plaintext akhir.

---

## 🎨 Tampilan Modern

* Clean Academic Theme
* Responsive Design
* Bit Visualization
* Step-by-Step Trace
* S-Box Highlighting
* Mobile Friendly

---

## 🚀 Instalasi & Menjalankan Project

### Clone Repository

```bash
git clone https://github.com/username/sdes-simulator.git
```

Masuk ke folder project:

```bash
cd sdes-simulator
```

### Jalankan Aplikasi

Karena menggunakan HTML, CSS, dan JavaScript murni, cukup buka:

```bash
index.html
```

di browser.

Atau gunakan Live Server pada VS Code.

---

## 📂 Struktur Project

```text
project/
│
├── index.html      # Struktur halaman utama
├── style.css       # Styling dan tampilan aplikasi
├── sdes.js         # Implementasi algoritma S-DES
├── ui.js           # Interaksi dan rendering UI
│
└── README.md
```

---

## ⚙️ Cara Penggunaan

### 1. Input Data

Masukkan:

* Plaintext/Ciphertext (8 bit)
* Key (10 bit)

Contoh:

```text
Plaintext : 10110100
Key       : 1010000010
```

### 2. Pilih Mode

* Enkripsi
* Dekripsi

### 3. Klik Tombol Proses

Aplikasi akan:

* Membentuk subkey K1 dan K2
* Menjalankan algoritma S-DES
* Menampilkan hasil akhir

### 4. Lihat Langkah Perhitungan

Klik:

```text
Tampilkan Langkah Perhitungan
```

untuk melihat seluruh proses algoritma secara detail.

---

## 📖 Algoritma S-DES

Simplified Data Encryption Standard (S-DES) merupakan versi sederhana dari DES yang dikembangkan oleh **Edward Schaefer** untuk tujuan pendidikan.

### Parameter

| Komponen   | Ukuran |
| ---------- | ------ |
| Plaintext  | 8 bit  |
| Ciphertext | 8 bit  |
| Key        | 10 bit |
| Subkey K1  | 8 bit  |
| Subkey K2  | 8 bit  |

### Tabel Permutasi

#### P10

```text
[3,5,2,7,4,10,1,9,8,6]
```

#### P8

```text
[6,3,7,4,8,5,10,9]
```

#### IP

```text
[2,6,3,1,4,8,5,7]
```

#### IP⁻¹

```text
[4,1,3,5,7,2,8,6]
```

#### EP

```text
[4,1,2,3,2,3,4,1]
```

#### P4

```text
[2,4,3,1]
```

---

## 🧮 Alur Enkripsi

```text
Plaintext
    ↓
IP
    ↓
Round 1 (K1)
    ↓
Swap
    ↓
Round 2 (K2)
    ↓
IP⁻¹
    ↓
Ciphertext
```

## 🔓 Alur Dekripsi

```text
Ciphertext
    ↓
IP
    ↓
Round 1 (K2)
    ↓
Swap
    ↓
Round 2 (K1)
    ↓
IP⁻¹
    ↓
Plaintext
```

---

## 🛠️ Teknologi yang Digunakan

| Teknologi        | Fungsi                               |
| ---------------- | ------------------------------------ |
| HTML5            | Struktur halaman                     |
| CSS3             | Desain dan layout                    |
| JavaScript (ES6) | Implementasi algoritma dan interaksi |
| GitHub Pages     | Deployment aplikasi                  |

---

## 🎓 Tujuan Pembelajaran

Project ini dibuat untuk:

* Memahami konsep kriptografi simetris.
* Mempelajari struktur algoritma DES melalui versi sederhananya.
* Memvisualisasikan proses enkripsi dan dekripsi secara interaktif.
* Menjadi media pembelajaran bagi mahasiswa mata kuliah Kriptografi.

---

## 👨‍💻 Author

**Hikmal Akbar Ramadhan**

* NIM: 301230044
* Kelas: IF 6B
* Mata Kuliah: Kriptografi
* Program Studi Informatika

---

## 📚 Referensi

* William Stallings, *Cryptography and Network Security*
* Edward F. Schaefer, *A Simplified Data Encryption Standard Algorithm*
* Mozilla Developer Network (MDN)
* W3Schools Documentation

---

## ⭐ Dukungan

Jika project ini membantu proses belajar Anda, jangan lupa berikan **Star ⭐** pada repository ini.

---

<div align="center">

Made with ❤️ for Cryptography Learning

</div>
