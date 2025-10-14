# F-Beta botz

![F-Beta Banner](https://github.com/Adzy-xyz.png?size=500)

F-Beta adalah bot WhatsApp yang simple keren dan elegan Menggunakan base dari ESEMPE-MD

---

## Intfo
```js
let txt = '';
txt += 'Menggunakan Bahasa Pemrograman: '; // Javascript (Node.js)
txt += 'Versi yabg di pake: '; // v20+
txt += 'Fokus pada stabilitas dan kanyaman panggunaan';
```

---

## Instalasi & Menjalankan
1. Clone repository
   ```bash
   git clone https://github.com/Adzy-xyz/F-Beta
   cd F-Beta
   ```

2. Install dependensi
   ```bash
   npm install
   # atau
   yarn
   ```

3. Jalankan bot
   ```bash
   npm start
   ```

4. Masukkan Code Pairing
   - Pada jalankan pertama, Pairing Code akan muncul di terminal. Masukkan di WhatsApp untuk autentikasi.
   
---

## Pakai Pm2 buat produksi
```bash
npm run pm2
```



## Tutor cara bagaimana Cara tutor membuat plugin 

```js
export default {
  name: "name.fiture", // Ini nama pitrue nya
  category: "category.fiture", // ini kategroi jya
  command: ["cmd.fiture"], // ini command nya bisa beberapa command juga kayak aliyases
  settings: {
    owner: false,
    admin: false,
    private: false,
    group: false,
    loading: false,
    botAdmin: false
  }, // bagian ini buat seting seting apa gtu
  run: async (conn, m) => { 
  /* [ Tulis kode nya di sini yah] */
  }
}

/*============= Contoh =============*/
// tambahin di folder plugins terserah nama filenya apa di folder mana dan bagaimana seperti apa terserah yang penting taro di folder plugins jangan taro di hati dia percuma ga bakal tereksekusi 💔😔
export default {
  name: "log", 
  category: "test",
  command: ["log", "logger"], // misal gini
  settings: {
    owner: false,
    admin: false,
    private: false,
    group: false,
    loading: false,
    botAdmin: false
  }, // bagian ini buat seting seting apa gtu
  run: async (conn, m, { Func, log }) => {  // yang di dalam Object {} itu optional klo lu kau import ctx Dari handler.js ( eee kayaknya )
     if (!m.text) return m.reply(Func.ex(m.cmd, false, "text", "F-Beta")) // fungsi buat anu example 
     log.info("Tereksekusi: " + m.text)
  }
}

/*============= Penggunaan =============*/
.log F-Beta/ .logger F-Beta
// nanti di console muncul 
Tereksekusi: F-Beta
```
---

## tidak untuk di Tiru 
```dev.js
const handler = {
  name: "setart", // fitur name
  category: "dev", // category name
  command: ["setart"], // command name
  run: async (conn, m) => {
  /* [ Execution ] */
  await m.reply("berhasil Di jalankan")
  }
}

export default handler
```

```dev.js
class Handler {
  constructor() {
    this.name: "setart", // fitur name
    this.category: "dev", // category name
    this.command: ["setart"], // command name
  run = async (conn, m) => {
    /* [ Execution ] */
    await m.reply("berhasil Di jalankan")
    }
  }
}

export default new Handler
```

---

## Kontribusi
Kontribusi kecil diterima (bugfix, perbaikan dokumentasi, penambahan perintah minimal). Langkah:
1. Fork repository
2. Buat branch: git checkout -b feat/nama-fitur
3. Commit & push
4. Buka Pull Request

Untuk perubahan fitur besar, buka issue dulu supaya dibahas.

---
## Kontol 
- Adzy-xyz (Dev Fanz) 
- Om Agus (Base bot)

## Thanks To
[![Dika Ardnt](https://github.com/DikaArdnt.png?size=100)](https://github.com/DikaArdnt)
[![WhiskeySockets](https://github.com/WhiskeySockets.png?size=100)](https://github.com/WhiskeySockets/Baileys)
[![Axell](https://github.com/AxellNetwork.png?size=100)](https://github.com/AxellNetwork)
[![Senn](https://github.com/synshin9.png?size=100)](https://github.com/synshin9)

## Contributor
[![Om Agus](https://github.com/AgusXzz.png?size=100)](https://github.com/AgusXzz)

---# F‑Beta Bot

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

**Contributor**

[![Om Agus](https://github.com/AgusXzz.png?size=100)](https://github.com/AgusXzz)  