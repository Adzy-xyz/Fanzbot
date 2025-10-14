import util from 'util'
import cp from 'child_process'

export default {
  name: "Eval & Exec",
  on: async (m, ctx) => {
    const { conn, isOwner, Scrape, Api } = ctx
    if (!isOwner) return 
    if (['e', 'ev'].some((a) => m.body?.toLowerCase().startsWith(a)) && isOwner) {
      let evalCmd = ''
      try {
        evalCmd = /await/i.test(m.text) ?
          eval(`(async() => { ${m.text} })()`) :
          eval(m.text)
      } catch (e) {
        evalCmd = e
      }

      new Promise((resolve, reject) => {
          try {
            resolve(evalCmd)
          } catch (err) {
            reject(err)
          }
        })
        ?.then((res) => m.reply(util.format(res)))
        ?.catch((err) => m.reply(util.format(err)))
    }

    if (m.body?.startsWith('$') && isOwner) {
      const exec = util.promisify(cp.exec).bind(cp)
      let o
      try {
        o = await exec(m.text)
      } catch (e) {
        o = e
      } finally {
        const {
          stdout,
          stderr
        } = o
        if (stdout.trim()) m.reply(stdout)
        if (stderr.trim()) m.reply(stderr)
      }
    }
  }}