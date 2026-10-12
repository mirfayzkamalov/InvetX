import { useEffect, useState } from 'react'
import InvitationCard from './InvitationCard.jsx'

function Modal({ onClose, children, wide }) {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [onClose])
  return <div className="overlay" onClick={onClose}><div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>{children}</div></div>
}

export function ShareModal({ d, onClose }) {
  const [copied, setCopied] = useState(false)
  const [id] = useState(() => {
    const slug = d.names.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'taklifnoma'
    return `${slug}-${Math.random().toString(36).slice(2, 6)}`
  })
  const link = `https://invite-x.com/i/${id}`
  const copy = async () => { try { await navigator.clipboard.writeText(link) } catch {} setCopied(true); setTimeout(() => setCopied(false), 1800) }
  const text = encodeURIComponent(`${d.title}: ${d.names}`)
  return (
    <Modal onClose={onClose}>
      <h3>Ulashish</h3>
      <div className="linkbox"><input readOnly value={link} aria-label="Taklifnoma havolasi" /><button className="btn gold" onClick={copy}>{copied ? 'Nusxalandi ✓' : 'Copy'}</button></div>
      <div className="share-row">
        <button className="btn" onClick={copy}>Linkni nusxalash</button>
        <a className="btn" target="_blank" rel="noreferrer" href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`}>Telegram</a>
        <a className="btn" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${text}%20${encodeURIComponent(link)}`}>WhatsApp</a>
      </div>
      <p className="hint">Demo rejim: havola faqat namuna sifatida yaratiladi.</p>
      <button className="btn ghost" onClick={onClose}>Yopish</button>
    </Modal>
  )
}

export function FullscreenPreview({ d, image, onClose }) {
  return (
    <div className="overlay full" onClick={onClose}>
      <button className="btn close" onClick={onClose} aria-label="Yopish">✕ Yopish</button>
      <div onClick={(e) => e.stopPropagation()}><InvitationCard d={d} image={image} /></div>
    </div>
  )
}

export function ConfirmReset({ onOk, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h3>Taklifnomani tozalashni xohlaysizmi?</h3>
      <p className="hint">Barcha kiritilgan ma'lumotlar o'chiriladi.</p>
      <div className="share-row"><button className="btn" onClick={onClose}>Bekor qilish</button><button className="btn gold" onClick={onOk}>Tozalash</button></div>
    </Modal>
  )
}
