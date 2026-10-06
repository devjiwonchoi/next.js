const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright-core')
const out = '/workspace/artifacts/upgrade-cli'
;(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 1370, height: 1400 }, deviceScaleFactor: 1 })
  const captures = JSON.parse(fs.readFileSync(path.join(out, 'captures.json')))
  const summaries = {}
  for (const name of captures) {
    await page.setContent('<html><body style="margin:0;background:#080808;padding:24px"><div id="window" style="border:1px solid #333;border-radius:16px;background:#000;padding:20px"><div style="height:36px;color:#888;font:14px sans-serif"><span style="color:#ff5f56">●</span> <span style="color:#ffbd2e">●</span> <span style="color:#27c93f">●</span><span style="float:right">Next.js upgrade CLI · fixture agents</span></div><div id="terminal"></div></div></body></html>')
    await page.addStyleTag({ path: '/tmp/upgrade-check/node_modules/@xterm/xterm/css/xterm.css' })
    await page.addScriptTag({ path: '/tmp/upgrade-check/node_modules/@xterm/xterm/lib/xterm.js' })
    const raw = fs.readFileSync(path.join(out, name+'.ansi'), 'utf8')
    const result = await page.evaluate(async raw => {
      const term = new Terminal({ cols: 120, rows: 55, fontSize: 17, lineHeight: 1.2, fontFamily: 'DejaVu Sans Mono, monospace', theme: { background: '#000000', foreground: '#cccccc', cyan: '#65d9ef', brightCyan: '#65d9ef' }, allowProposedApi: true, scrollback: 1000, cursorBlink: false })
      term.open(document.getElementById('terminal'))
      await new Promise(resolve => term.write(raw, resolve))
      const lines = []
      for (let i = 0; i < term.buffer.active.length; i++) lines.push(term.buffer.active.getLine(i).translateToString(true))
      while (!lines[lines.length-1] && lines.length) lines.pop()
      const count = Math.max(lines.length+1, 8)
      term.resize(120, count)
      document.getElementById('terminal').style.height = (term.element.querySelector('.xterm-screen').getBoundingClientRect().height)+'px'
      return { lines, height: document.getElementById('window').getBoundingClientRect().height+48 }
    }, raw)
    await page.screenshot({ path: path.join(out, name+'.png'), clip: { x: 0, y: 0, width: 1370, height: Math.min(result.height, 1400) } })
    summaries[name] = result.lines.join('\n')
  }
  fs.writeFileSync(path.join(out,'terminal-screens.json'), JSON.stringify(summaries, null, 2))
  const titles = { '01-agent': '1. Agent selection', '02-model': '2. Model selection — previous agent retained', '03-effort': '3. Reasoning effort — previous agent and model retained', '04-permission': '4. Permission mode — reasoning effort retained', '05-worktree': '5. Worktree — permission retained', '06-completed-codex': '6. All confirmed selections' }
  const html = '<!doctype html><meta charset="utf-8"><title>Next.js upgrade CLI screenshots</title><style>body{font:16px system-ui;background:#111;color:#eee;max-width:1370px;margin:40px auto;padding:0 24px}img{width:100%;border-radius:12px}h2{margin-top:48px}a{color:#65d9ef}</style><h1>Next.js upgrade CLI — confirmed selections</h1><p>Actual CLI output captured in a PTY and rendered with xterm.js. Fixture agents are used; no project upgrade was run.</p>'+captures.map(name=>`<h2>${titles[name] || name}</h2><a href="${name}.png"><img src="${name}.png" alt="${titles[name] || name}"></a>`).join('')
  fs.writeFileSync(path.join(out, 'index.html'), html)
  console.log(`Rendered ${captures.length} screenshots`)
  await browser.close()
})().catch(e => { console.error(e); process.exitCode = 1 })
