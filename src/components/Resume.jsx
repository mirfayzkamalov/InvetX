import { useEffect, useRef, useState } from 'react'
import { exportPng } from '../utils/exportImage.js'
import { COLORS } from '../data/templates.js'
import { shrink } from '../utils/shrinkImage.js'

const STYLES = [['dark', 'Qora'], ['light', 'Oq'], ['split', 'Rangli'], ['gradient', 'Gradient']]
const DEF = {
  name: 'Elyor Karimov', role: 'Frontend dasturchi',
  about: "Salom! Men React va zamonaviy CSS bilan tez va qulay veb-ilovalar yarataman. Jamoada ishlashni, yangi texnologiyalarni o'rganishni va murakkab masalalarga ijodiy yechim topishni yaxshi ko'raman.",
  langs: "O'zbek | 5\nRus | 4\nInglis | 4",
  skills: 'React | 5\nJavaScript | 5\nCSS | 4\nFigma | 3',
  exp: 'Iyun 2023 – hozir | Frontend dasturchi | Tech LLC, Toshkent\n2021 – 2023 | Web dizayner | Studio Nur, Toshkent',
  edu: "2017 – 2021 | Bakalavr, Axborot texnologiyalari | TATU, Toshkent",
  phone: '+998 90 123 45 67', telegram: '@elyor', site: 'elyor.uz', email: 'elyor@mail.com', address: 'Toshkent, Amir Temur ko\'chasi 12',
  style: 'dark', color: '#c9a24b',
}
const OK = ['image/jpeg', 'image/png', 'image/webp']
const rows = (s) => s.split('\n').map((l) => l.split('|').map((x) => x.trim())).filter((r) => r[0])
const rate = (v) => Math.min(5, Math.max(1, parseInt(v, 10) || 5))

const Stars = ({ n }) => <span className="stars" aria-label={`${n} / 5`}>{[1, 2, 3, 4, 5].map((i) => <b key={i} className={i <= n ? 'on' : ''}>★</b>)}</span>
export default function Resume({ tab }) {
  const [d, setD] = useState(() => { try { return { ...DEF, ...JSON.parse(localStorage.getItem('invitex-cv3') || '{}') } } catch { return DEF } })
  const [photo, setPhoto] = useState(() => { try { return localStorage.getItem('invitex-cv-photo') || '' } catch { return '' } })
  const [err, setErr] = useState('')
  const file = useRef(null)
  const ref = useRef(null)
  const set = (k) => (e) => setD((s) => ({ ...s, [k]: e.target.value }))
  useEffect(() => { try { localStorage.setItem('invitex-cv3', JSON.stringify(d)) } catch {} }, [d])
  useEffect(() => { try { photo ? localStorage.setItem('invitex-cv-photo', photo) : localStorage.removeItem('invitex-cv-photo') } catch {} }, [photo])

  const upload = async (e) => {
    const f = e.target.files[0]; e.target.value = ''
    if (!f) return
    if (!OK.includes(f.type)) return setErr("Bu rasm formatini qo'llab-quvvatlab bo'lmaydi.")
    if (f.size > 8 * 1024 * 1024) return setErr('Rasm juda katta. 8 MB dan kichik rasm tanlang.')
    try { setPhoto(await shrink(f)); setErr('') } catch { setErr("Rasmni o'qib bo'lmadi.") }
  }
  const download = async () => { try { await exportPng(ref.current, 'rezyume.png', '#ffffff') } catch (e) { console.error(e); alert('Yuklab olishda xatolik.') } }

  const F = ([k, label, area]) => <label key={k}>{label}{area ? <textarea rows="3" value={d[k]} onChange={set(k)} /> : <input value={d[k]} onChange={set(k)} />}</label>
  const langs = rows(d.langs), skills = rows(d.skills), exp = rows(d.exp), edu = rows(d.edu)
  const contacts = [d.phone, d.telegram, d.site, d.email, d.address].filter(Boolean)
  const initials = d.name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('')
  const Rate = ({ title, list }) => list.length > 0 && (
    <section><h4>{title}</h4><ul className="rate">{list.map((r, i) => <li key={i}><span>{r[0]}</span><Stars n={rate(r[1])} /></li>)}</ul></section>
  )
  const Timeline = ({ title, list }) => list.length > 0 && (
    <section><h4>{title}</h4><ul className="tl">{list.map((r, i) => <li key={i}><b>{r[1] || r[0]}</b>{r[2] && <span>{r[2]}</span>}{r[1] && <i>{r[0]}</i>}</li>)}</ul></section>
  )

  return (
    <main className={`layout show-${tab}`}>
      <aside className="left"><div className="editor">
        <section className="sec"><h3>Rasm</h3><p className="hint">Ixtiyoriy · JPG, PNG, WEBP</p>
          {photo ? <div className="thumb"><img src={photo} alt="Rezyume rasmi" /><button className="btn" onClick={() => setPhoto('')}>O'chirish</button></div>
            : <button className="drop" onClick={() => file.current.click()}><span>⬆</span>Rasm qo'shish<small>Ixtiyoriy</small></button>}
          <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={upload} />
          {err && <p className="err" role="alert">{err}</p>}
        </section>
        <section className="sec"><h3>Shaxsiy ma'lumotlar</h3>{[['name', 'Ism familiya'], ['role', 'Lavozim']].map(F)}</section>
        <section className="sec"><h3>Haqimda</h3>{F(['about', 'Qisqacha', true])}</section>
        <section className="sec"><h3>Tillar</h3><p className="hint">Har qator: nom | 1–5 (yulduz)</p>{F(['langs', 'Tillar', true])}</section>
        <section className="sec"><h3>Ko'nikmalar</h3><p className="hint">Har qator: nom | 1–5 (yulduz)</p>{F(['skills', "Ko'nikmalar", true])}</section>
        <section className="sec"><h3>Tajriba</h3><p className="hint">Har qator: yillar | lavozim | kompaniya</p>{F(['exp', 'Tajriba', true])}</section>
        <section className="sec"><h3>Ta'lim</h3><p className="hint">Har qator: yillar | daraja | o'quv yurti</p>{F(['edu', "Ta'lim", true])}</section>
        <section className="sec"><h3>Aloqa</h3>{[['phone', 'Telefon'], ['telegram', 'Telegram'], ['site', 'Sayt'], ['email', 'Email'], ['address', 'Manzil']].map(F)}</section>
        <section className="sec"><h3>Uslub</h3>
          <div className="chips">{STYLES.map(([id, l]) => <button key={id} className={`chip ${d.style === id ? 'on' : ''}`} onClick={() => setD((x) => ({ ...x, style: id }))}>{l}</button>)}</div></section>
        <section className="sec"><h3>Rang</h3>
          <div className="swatches">{COLORS.map(([n, c]) => <button key={n} className={`sw ${d.color === c ? 'on' : ''}`} style={{ background: c }} aria-label={n} onClick={() => setD((x) => ({ ...x, color: c }))} />)}
            <label className="sw pick" title="Boshqa rang">+<input type="color" value={d.color} onChange={set('color')} aria-label="Boshqa rang" /></label></div></section>
        <button className="btn ghost wide-btn" onClick={() => { setD(DEF); setPhoto('') }}>Tozalash</button>
      </div></aside>
      <section className="right" aria-label="Rezyume ko'rinishi">
        <div className="stage">
          <article className={`cv2 cv2-${d.style}`} ref={ref} style={{ '--ac': d.color }}>
            <div className="cv2-col">
              <header className="cv2-name"><h1>{d.name}</h1>{d.role && <p>{d.role}</p>}</header>
              <Rate title="Tillar" list={langs} />
              <Rate title="Ko'nikmalar" list={skills} />
            </div>
            <div className="cv2-col mid">
              <div className="cv2-photo">{photo ? <img src={photo} alt="Rezyume egasining rasmi" /> : <span>{initials || '✦'}</span>}</div>
              {d.about && <section><h4>Haqimda</h4><p className="about">{d.about}</p></section>}
              {contacts.length > 0 && <section><h4>Aloqa</h4><ul className="ct">{contacts.map((c, i) => <li key={i}>{c}</li>)}</ul></section>}
            </div>
            <div className="cv2-col">
              <Timeline title="Tajriba" list={exp} />
              <Timeline title="Ta'lim" list={edu} />
            </div>
          </article>
        </div>
        <div className="actions"><button className="btn gold big" onClick={download}>⬇ Yuklab olish</button><button className="btn" onClick={() => window.print()}>Chop etish</button></div>
      </section>
    </main>
  )
}
