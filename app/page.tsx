export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="landing-card">
        <img className="brand-logo hero-logo" src="/wevermore-logo.png" alt="Wevermore logo" />
        <span className="eyebrow">WEVERMORE</span>
        <h1>Ticket Transcript</h1>
        <p>Gunakan URL transcript yang dikirim oleh bot Discord. Setiap URL sudah ditandatangani, aman, dan otomatis kedaluwarsa.</p>
        <div className="landing-actions">
          <span className="amount-chip">Secure URL</span>
          <span className="amount-chip">Gzip Archive</span>
          <span className="amount-chip">UAID Signed</span>
        </div>
      </section>
    </main>
  );
}
