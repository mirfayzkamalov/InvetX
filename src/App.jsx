import { useEffect, useRef, useState } from 'react'
import { exportPng } from './utils/exportImage.js'
import Visitka from './components/Visitka.jsx'
import Resume from './components/Resume.jsx'
import Header from './components/Header.jsx'
import Editor from './components/Editor.jsx'
import InvitationCard from './components/InvitationCard.jsx'
import { ShareModal, FullscreenPreview, ConfirmReset } from './components/Modals.jsx'

const DEF = {
  template: 'emerald', type: 'toy', title: "To'y taklifnomasi", names: 'Elyor & Malika',
  message: "Sizni hayotimizning eng baxtli kunida biz bilan birga bo‘lishga taklif qilamiz.",
  date: '2026-12-12', time: '18:00', location: "Navro'z to'yxonasi, Toshkent",
  color: '', font: 'elegant', rsvpOn: true, musicOn: false,
}
const load = () => { try { return { ...DEF, ...JSON.parse(localStorage.getItem('invitex') || '{}') } } catch { return DEF } }

export default function App() {
  const [d, setD] = useState(load)
  const [image, setImage] = useState(() => { try { return localStorage.getItem('invitex-img') || '' } catch { return '' } })
  const [mode, setMode] = useState('invite')
  const [tab, setTab] = useState('edit')
  const [modal, setModal] = useState(null)
  const [busy, setBusy] = useState(false)
  const ref = useRef(null)
  const set = (p) => setD((s) => ({ ...s, ...p }))
  useEffect(() => { try { localStorage.setItem('invitex', JSON.stringify(d)) } catch {} }, [d])

  useEffect(() => { try { image ? localStorage.setItem('invitex-img', image) : localStorage.removeItem('invitex-img') } catch {} }, [image])
  const download = async () => {
    if (!ref.current) return
    setBusy(true)
    try { await exportPng(ref.current, 'taklifnoma.png') } catch (e) { console.error(e); alert("Yuklab olishda xatolik. Qayta urinib ko'ring.") }
    setBusy(false)
  }
  const reset = () => { setD(DEF); setImage(''); try { localStorage.removeItem('invitex-rsvp') } catch {} setModal(null) }

  return (
    <div className="app">
      <Header mode={mode} setMode={setMode} />
      <div className="tagline">{mode === 'resume' ? 'Professional rezyume. Bir necha daqiqada.' : mode === 'card' ? 'Zamonaviy visitka. Bir necha daqiqada.' : 'Chiroyli taklifnoma. Bir necha daqiqada.'}</div>
      {mode === 'resume' ? <Resume tab={tab} /> : mode === 'card' ? <Visitka tab={tab} /> : <main className={`layout show-${tab}`}>
        <aside className="left"><Editor d={d} set={set} image={image} setImage={setImage} onReset={() => setModal('reset')} /></aside>
        <section className="right" aria-label="Jonli ko'rinish">
          <div className="stage"><InvitationCard d={d} image={image} cardRef={ref} /></div>
          <div className="actions">
            <button className="btn gold big" onClick={download} disabled={busy}>⬇ {busy ? 'Tayyorlanmoqda…' : 'Yuklab olish'}</button>
            <button className="btn" onClick={() => setModal('share')}>Ulashish</button>
            <button className="btn" onClick={() => setModal('full')}>To'liq ekran</button>
            <button className="btn" onClick={() => window.print()}>Chop etish</button>
          </div>
        </section>
      </main>}
      <div className="mobile-bar">
        <button className={tab === 'edit' ? 'on' : ''} onClick={() => setTab('edit')}>Tahrirlash</button>
        <button className={tab === 'preview' ? 'on' : ''} onClick={() => setTab('preview')}>Ko'rish</button>
      </div>
      {modal === 'share' && <ShareModal d={d} onClose={() => setModal(null)} />}
      {modal === 'full' && <FullscreenPreview d={d} image={image} onClose={() => setModal(null)} />}
      {modal === 'reset' && <ConfirmReset onOk={reset} onClose={() => setModal(null)} />}
    </div>
  )
}
