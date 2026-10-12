import { toPng } from 'html-to-image'

// Elementni PNG qilib yuklab beradi (CSS o'zgaruvchilari, gradientlar va pseudo-elementlar bilan).
export async function exportPng(el, filename, bg) {
  if (!el) return
  try { await document.fonts.ready } catch {}
  const r = el.getBoundingClientRect()
  const url = await toPng(el, {
    pixelRatio: 2,
    width: Math.round(r.width),
    height: Math.round(r.height),
    backgroundColor: bg,
    filter: (n) => !(n.dataset && n.dataset.noExport),
    style: { animation: 'none', transform: 'none', margin: '0', boxShadow: 'none' },
  })
  const a = document.createElement('a')
  a.download = filename
  a.href = url
  a.click()
}
