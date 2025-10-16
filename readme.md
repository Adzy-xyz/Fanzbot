# F‑Beta Bot

![F‑Beta Banner](https://github.com/Adzy-xyz.png?size=500)

F‑Beta adalah bot WhatsApp yang simpel, keren, dan elegan. Bot ini dibangun di atas basis **ESEMPE‑MD**.

---

## Info
```js
let txt = '';
txt += 'Menggunakan Bahasa Pemrograman: JavaScript (Node.js)\n';
txt += 'Versi yang dipakai: v20+\n';
txt += 'Fokus pada stabilitas dan keamanan penggunaan';
```

---

## Instalasi & Menjalankan

1. **Clone repository**
   ```bash
   git clone https://github.com/Adzy-xyz/F-Beta
   cd F-Beta
   ```

2. **Install dependensi**
   ```bash
   npm install
   # atau
   yarn
   ```

3. **Jalankan bot**
   ```bash
   npm start
   ```

4. **Masukkan Pairing Code**  
   Pada pertama kali dijalankan, kode pairing akan muncul di terminal. Masukkan kode tersebut di WhatsApp untuk autentikasi.

---

## Menjalankan dengan PM2 (untuk produksi)

```bash
npm run pm2
```

---

## Membuat Plugin

Berikut contoh struktur dasar sebuah plugin. Simpan file di folder `plugins/` dengan nama apa saja.

```js
export default {
  name: "log",                     // Nama plugin
  category: "test",                // Kategori
  command: ["log", "logger"],      // Perintah (bisa lebih dari satu)
  settings: {
    owner: false,
    admin: false,
    private: false,
    group: false,
    loading: false,
    botAdmin: false
  },
  /**
   * @param {Object} conn   - Objek koneksi bot
   * @param {Object} m      - Pesan yang diterima
   * @param {Object} ctx    - (Opsional) objek tambahan dari handler
   */
  run: async (conn, m, { Func, log }) => {
    if (!m.text) return m.reply(Func.ex(m.cmd, false, "text", "F‑Beta"));
    log.info("Tereksekusi: " + m.text);
  }
};
```

**Penggunaan**

```
.log F-Beta
.logger F-Beta
```

Console akan menampilkan:

```
Tereksekusi: F-Beta
```

---

## Contoh Handler (tidak untuk ditiru)

```js
// dev.js
export const handler = {
  name: "setart",
  category: "dev",
  command: ["setart"],
  run: async (conn, m) => {
    await m.reply("Berhasil dijalankan");
  }
};

export default handler;
```

```js
// dev.js (kelas)
class Handler {
  constructor() {
    this.name = "setart";
    this.category = "dev";
    this.command = ["setart"];
  }

  run = async (conn, m) => {
    await m.reply("Berhasil dijalankan");
  };
}

export default new Handler();
```

---

## Kontribusi

Kontribusi kecil (bug‑fix, perbaikan dokumentasi, penambahan perintah minimal) sangat diterima.

1. Fork repository
2. Buat branch baru: `git checkout -b feat/nama-fitur`
3. Commit & push perubahan
4. Buka Pull Request

Untuk perubahan fitur besar, **buka issue terlebih dahulu** agar dapat didiskusikan.

---

## Kredit

**Thanks To**

[![Dika Ardnt](https://github.com/DikaArdnt.png?size=100)](https://github.com/DikaArdnt) 
[![WhiskeySockets](https://github.com/WhiskeySockets.png?size=100)](https://github.com/WhiskeySockets/Baileys) 
[![Axell](https://github.com/AxellNetwork.png?size=100)](https://github.com/AxellNetwork) 
[![Senn](https://github.com/synshin9.png?size=100)](https://github.com/synshin9)

**Based**

[![Om Agus](https://github.com/AgusXzz.png?size=100)](https://github.com/AgusXzz) 