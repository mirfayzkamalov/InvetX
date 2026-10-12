export default function Header({ mode, setMode }) {
  return (
    <header className="header">
      <div className="brand"><span className="logo">✦</span><div><b>InviteX</b><small>Digital Invitation Studio</small></div></div>
      <nav aria-label="Asosiy">
        <button className={mode === 'invite' ? 'on' : ''} onClick={() => setMode('invite')}>Taklifnoma</button>
        <button className={mode === 'card' ? 'on' : ''} onClick={() => setMode('card')}>Visitka</button>
        <button className={mode === 'resume' ? 'on' : ''} onClick={() => setMode('resume')}>Rezyume</button>
      </nav>
      <div className="hright">
        <button className="icon-btn" aria-label="Mavzu">◐</button>
        <button className="icon-btn" aria-label="Yordam">?</button>
        <span className="avatar" aria-label="Profil">U</span>
      </div>
    </header>
  )
}
