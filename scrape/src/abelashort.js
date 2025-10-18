  /*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Short url ada abella apaci apacu (SCRAPE)
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/
  
  import axios from 'axios'
  
  async function shorturl(url) {
      const res = await axios.post(
        'https://short.abella.icu/api/shorten', {
          url: url
        }, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://short.abella.icu/'
          },
          compress: true
        })
      return res.data
  }
  
  export default shorturl;
