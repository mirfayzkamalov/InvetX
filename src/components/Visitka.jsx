import { useEffect, useRef, useState } from 'react'
import { exportPng } from '../utils/exportImage.js'
import { COLORS } from '../data/templates.js'
import { shrink } from '../utils/shrinkImage.js'

const DEF = {
  name: 'Elyor Karimov', role: 'Frontend dasturchi', company: 'Tech LLC',
  phone: '+998 90 123 45 67', email: 'elyor@mail.com', site: 'elyor.uz', address: "Toshkent, Amir Temur ko'chasi 12",
  style: 'dark', color: '#c9a24b',
}
const OK = ['image/jpeg', 'image/png', 'image/webp']
const STYLES = [['dark', 'Qora'], ['light', 'Oq'], ['split', 'Rangli'], ['gradient', 'Gradient']]

export default function Visitka({ tab }) {
  const [d, setD] = useState(() => { try { return { ...DEF, ...JSON.parse(localStorage.getItem('invitex-card') || '{}') } } catch { return DEF } })
  const front = useRef(null)
  const back = useRef(null)
  const [flip, setFlip] = useState(false)
  const [photo, setPhoto] = useState(() => { try { return localStorage.getItem('invitex-card-photo') || '' } catch { return '' } })
  const [err, setErr] = useState('')
  const file = useRef(null)
  useEffect(() => { try { photo ? localStorage.setItem('invitex-card-photo', photo) : localStorage.removeItem('invitex-card-photo') } catch {} }, [photo])
  const upload = async (e) => {
    const f = e.target.files[0]; e.target.value = ''
    if (!f) return
    if (!OK.includes(f.type)) return setErr("Bu rasm formatini qo'llab-quvvatlab bo'lmaydi.")
    if (f.size > 8 * 1024 * 1024) return setErr('Rasm juda katta. 8 MB dan kichik rasm tanlang.')
    try { setPhoto(await shrink(f)); setErr(''); setFlip(true) } catch { setErr("Rasmni o'qib bo'lmadi.") }
  }
  const set = (k) => (e) => setD((s) => ({ ...s, [k]: e.target.value }))
  useEffect(() => { try { localStorage.setItem('invitex-card', JSON.stringify(d)) } catch {} }, [d])

  const save = async (el, name) => { try { await exportPng(el, name) } catch (e) { console.error(e); alert('Yuklab olishda xatolik.') } }
  const both = async () => { await save(front.current, 'visitka-old-tomon.png'); await save(back.current, 'visitka-orqa-tomon.png') }

  const F = ([k, label]) => <label key={k}>{label}<input value={d[k]} onChange={set(k)} /></label>
  const initials = d.name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('')
  const vars = { '--ac': d.color }
  return (
    <main className={`layout show-${tab}`}>
      <aside className="left"><div className="editor">
        <section className="sec"><h3>Rasm (orqa tomon)</h3><p className="hint">Ixtiyoriy · dumaloq shaklda chiqadi · JPG, PNG, WEBP</p>
          {photo ? <div className="thumb"><img src={photo} alt="Visitka rasmi" style={{ borderRadius: '50%' }} /><button className="btn" onClick={() => setPhoto('')}>O'chirish</button></div>
            : <button className="drop" onClick={() => file.current.click()}><span>⬆</span>Rasm qo'shish<small>Ixtiyoriy</small></button>}
          <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={upload} />
          {err && <p className="err" role="alert">{err}</p>}
        </section>
        <section className="sec"><h3>Ma'lumotlar</h3>
          {[['name', 'Ism familiya'], ['role', 'Lavozim'], ['company', 'Kompaniya']].map(F)}</section>
        <section className="sec"><h3>Aloqa</h3>
          {[['phone', 'Telefon'], ['email', 'Email'], ['site', 'Sayt'], ['address', 'Manzil']].map(F)}</section>
        <section className="sec"><h3>Uslub</h3>
          <div className="chips">{STYLES.map(([id, l]) => <button key={id} className={`chip ${d.style === id ? 'on' : ''}`} onClick={() => setD((s) => ({ ...s, style: id }))}>{l}</button>)}</div></section>
        <section className="sec"><h3>Rang</h3>
          <div className="swatches">{COLORS.map(([n, c]) => <button key={n} className={`sw ${d.color === c ? 'on' : ''}`} style={{ background: c }} aria-label={n} onClick={() => setD((s) => ({ ...s, color: c }))} />)}
            <label className="sw pick" title="Boshqa rang">+<input type="color" value={d.color} onChange={set('color')} aria-label="Boshqa rang" /></label></div></section>
        <button className="btn ghost wide-btn" onClick={() => { setD(DEF); setPhoto('') }}>Tozalash</button>
      </div></aside>
      <section className="right" aria-label="Visitka ko'rinishi">
        <div className="stage vc-stage">
          <div className="vc-flip" role="button" tabIndex={0} aria-label="Visitkani aylantirish" onClick={() => setFlip((f) => !f)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip((f) => !f) } }}>
            <div className={`vc-flip-in ${flip ? 'flipped' : ''}`}>
              <div ref={front} className={`vc front vc-${d.style}`} style={vars}>
                <div className="vc-mark">{initials}</div>
                <h2>{d.name}</h2>
                {d.role && <p className="role">{d.role}</p>}
                {d.company && <small className="co">{d.company}</small>}
              </div>
              <div ref={back} className={`vc back vc-${d.style}`} style={vars}>
                <div className="vc-brand">{d.company || d.name}</div>
                <div className="vc-body">
                  {photo && <div className="vc-photo"><img src={photo} alt="Visitka egasining rasmi" /></div>}
                  <ul className="vc-list">
                    {d.phone && <li><i>☎</i>{d.phone}</li>}
                    {d.email && <li><i>✉</i>{d.email}</li>}
                    {d.site && <li><i>◎</i>{d.site}</li>}
                    {d.address && <li><i>⌖</i>{d.address}</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p className="vc-hint">{flip ? 'Orqa tomon' : 'Old tomon'} · aylantirish uchun kartani bosing ↻</p>
        </div>
        <div className="actions">
          <button className="btn gold big" onClick={both}>⬇ Ikkalasini yuklab olish</button>
          <button className="btn" onClick={() => save(front.current, 'visitka-old-tomon.png')}>Old tomon</button>
          <button className="btn" onClick={() => save(back.current, 'visitka-orqa-tomon.png')}>Orqa tomon</button>
          <button className="btn" onClick={() => setFlip((f) => !f)}>↻ Aylantirish</button>
          <button className="btn" onClick={() => window.print()}>Chop etish</button>
        </div>
      </section>
    </main>
  )
}
