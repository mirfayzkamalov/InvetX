import { useRef, useState } from 'react'
import { TEMPLATES, COLORS, FONTS } from '../data/templates.js'
import { TYPES } from '../data/invitationTypes.js'

const OK = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const Sec = ({ title, hint, children }) => <section className="sec"><h3>{title}</h3>{hint && <p className="hint">{hint}</p>}{children}</section>

export default function Editor({ d, set, image, setImage, onReset }) {
  const [err, setErr] = useState('')
  const file = useRef(null)
  const upload = (e) => {
    const f = e.target.files[0]; if (!f) return
    if (!OK.includes(f.type)) return setErr("Bu rasm formatini qo'llab-quvvatlab bo'lmaydi.")
    if (f.size > 5 * 1024 * 1024) return setErr("Rasm juda katta. 5 MB dan kichik rasm tanlang.")
    setErr('')
    const r = new FileReader(); r.onload = () => setImage(r.result); r.onerror = () => setErr("Rasmni o'qib bo'lmadi."); r.readAsDataURL(f)
    e.target.value = ''
  }
  return (
    <div className="editor">
      <Sec title="Shablon">
        <div className="chips">{TEMPLATES.map((t) => <button key={t.id} className={`chip ${d.template === t.id ? 'on' : ''}`} onClick={() => set({ template: t.id })}><i style={{ background: t.bg }} />{t.name}</button>)}</div>
      </Sec>
      <Sec title="Taklifnoma turi">
        <div className="chips">{TYPES.map(([id, label, title]) => <button key={id} className={`chip ${d.type === id ? 'on' : ''}`} onClick={() => set({ type: id, title })}>{label}</button>)}</div>
      </Sec>
      <Sec title="Matnlar">
        <label>Sarlavha<input value={d.title} onChange={(e) => set({ title: e.target.value })} placeholder="To'y taklifnomasi" /></label>
        <label>Ismlar<input value={d.names} onChange={(e) => set({ names: e.target.value })} placeholder="Elyor & Malika" /></label>
        <label>Matn<textarea rows="3" value={d.message} onChange={(e) => set({ message: e.target.value })} /></label>
      </Sec>
      <Sec title="Sana va vaqt">
        <div className="two"><label>Sana<input type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} /></label>
          <label>Vaqt<input type="time" value={d.time} onChange={(e) => set({ time: e.target.value })} /></label></div>
        <label>Manzil<input value={d.location} onChange={(e) => set({ location: e.target.value })} placeholder="Navro'z to'yxonasi, Toshkent" /></label>
      </Sec>
      <Sec title="Rasm qo'shish" hint="Ixtiyoriy · JPG, PNG, WEBP · 5 MB gacha">
        {image ? (
          <div className="thumb"><img src={image} alt="Yuklangan rasm" /><button className="btn" onClick={() => setImage('')}>O'chirish</button></div>
        ) : (
          <button className="drop" onClick={() => file.current.click()}><span>⬆</span>Rasm qo'shish<small>Ixtiyoriy</small></button>
        )}
        <input ref={file} type="file" accept="image/*" hidden onChange={upload} />
        {err && <p className="err" role="alert">{err}</p>}
      </Sec>
      <Sec title="Rang">
        <div className="swatches">
          <button className={`sw auto ${!d.color ? 'on' : ''}`} onClick={() => set({ color: '' })} aria-label="Avto rang" title="Avto">A</button>
          {COLORS.map(([n, c]) => <button key={n} className={`sw ${d.color === c ? 'on' : ''}`} style={{ background: c }} title={n} aria-label={n} onClick={() => set({ color: c })} />)}
          <label className="sw pick" title="Boshqa rang">+<input type="color" value={d.color || '#c9a24b'} onChange={(e) => set({ color: e.target.value })} aria-label="Boshqa rang" /></label>
        </div>
      </Sec>
      <Sec title="Shrift">
        <div className="chips">{Object.entries(FONTS).map(([id, f]) => <button key={id} className={`chip ${d.font === id ? 'on' : ''}`} style={{ fontFamily: f.css }} onClick={() => set({ font: id })}>{f.label}</button>)}</div>
      </Sec>
      <Sec title="Qo'shimcha">
        <label className="toggle"><input type="checkbox" checked={d.rsvpOn} onChange={(e) => set({ rsvpOn: e.target.checked })} /> RSVP tugmasi</label>
        <label className="toggle"><input type="checkbox" checked={d.musicOn} onChange={(e) => set({ musicOn: e.target.checked })} /> Musiqa <small>(yumshoq melodiya)</small></label>
      </Sec>
      <button className="btn ghost wide-btn" onClick={onReset}>Tozalash</button>
    </div>
  )
}
