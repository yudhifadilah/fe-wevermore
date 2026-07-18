import type { DiscordEmbed, TranscriptResponse } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  dateStyle: "medium",
  timeStyle: "medium",
});

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${dateFormatter.format(date)} WIB`;
}

function textValue(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

function numberValue(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}

function EmbedCard({ embed }: { embed: DiscordEmbed }) {
  const borderColor = typeof embed.color === "number" ? `#${embed.color.toString(16).padStart(6, "0")}` : "#ff4fb8";
  return (
    <section className="discord-embed" style={{ borderLeftColor: borderColor }}>
      {embed.author?.name ? <div className="embed-author">{textValue(embed.author.name)}</div> : null}
      {embed.title ? (
        embed.url ? <a href={embed.url} target="_blank" rel="noreferrer" className="embed-title">{textValue(embed.title)}</a> : <div className="embed-title">{textValue(embed.title)}</div>
      ) : null}
      {embed.description ? <div className="message-content">{textValue(embed.description)}</div> : null}
      {embed.fields?.length ? (
        <div className="embed-fields">
          {embed.fields.map((field, index) => (
            <div className="embed-field" key={`${field.name}-${index}`}>
              <strong>{textValue(field.name)}</strong>
              <div className="message-content">{textValue(field.value)}</div>
            </div>
          ))}
        </div>
      ) : null}
      {embed.thumbnail?.url ? <img className="embed-thumbnail" src={embed.thumbnail.url} alt="Embed thumbnail" /> : null}
      {embed.image?.url ? <img className="embed-image" src={embed.image.url} alt="Embed attachment" /> : null}
      {embed.footer?.text ? <div className="embed-footer">{embed.footer.text}</div> : null}
    </section>
  );
}

export default function TranscriptView({ data }: { data: TranscriptResponse }) {
  const transcript = data.transcript;
  const messages = Array.isArray(transcript.messages) ? transcript.messages : [];
  const shopName = "Wevermore";
  return (
    <main className="page-shell">
      <header className="transcript-header">
        <div className="header-topline">
          <div className="profile-heading">
            <img className="brand-logo header-logo" src="/wevermore-logo.png" alt="Wevermore logo" />
            <div>
              <span className="eyebrow">{shopName} - Ticket Transcript</span>
              <h1>#{textValue(transcript.channel_name, "ticket")}</h1>
              <p className="header-subtitle">Riwayat ticket tersimpan aman dengan signed URL dan masa berlaku terbatas.</p>
            </div>
          </div>
          <div className="download-actions">
            <a className="button primary" href={data.download_html_url}>Download HTML</a>
            <a className="button secondary" href={data.download_gzip_url}>Download JSON.GZ</a>
          </div>
        </div>

        <div className="support-tabs" aria-label="Status transcript">
          <span className="support-tab active">Transcript</span>
          <span className="support-tab">Protected</span>
          <span className="support-tab">Expires {formatDate(data.expires_at)}</span>
        </div>

        <section className="checkout-panel" aria-label="Ringkasan ticket">
          <div>
            <span className="panel-label">Nominal Ticket</span>
            <strong>{rupiahFormatter.format(numberValue(transcript.amount))}</strong>
          </div>
          <div>
            <span className="panel-label">Buyer</span>
            <strong>{textValue(transcript.buyer_username, "-")}</strong>
          </div>
          <div>
            <span className="panel-label">Kategori</span>
            <strong>{textValue(transcript.category, "-")}</strong>
          </div>
        </section>

        <section className="metadata-grid">
          <div><span>Ticket ID</span><strong>{textValue(transcript.ticket_id, "-")}</strong></div>
          <div><span>Kategori</span><strong>{textValue(transcript.category, "-")}</strong></div>
          <div><span>Buyer</span><strong>{textValue(transcript.buyer_username, "-")}</strong></div>
          <div><span>Nominal</span><strong>{rupiahFormatter.format(numberValue(transcript.amount))}</strong></div>
          <div><span>Dibuat</span><strong>{formatDate(transcript.created_at)}</strong></div>
          <div><span>Ditutup</span><strong>{formatDate(transcript.closed_at)}</strong></div>
          <div><span>Pesan</span><strong>{numberValue(transcript.message_count).toLocaleString("id-ID")}</strong></div>
          <div><span>URL Kedaluwarsa</span><strong>{formatDate(data.expires_at)}</strong></div>
        </section>

        {transcript.close_note ? <div className="notice"><strong>Catatan penutupan:</strong> {textValue(transcript.close_note)}</div> : null}
        {transcript.truncated ? <div className="notice warning">Batas pesan tercapai. Sebagian pesan paling lama mungkin tidak disertakan.</div> : null}
      </header>

      <section className="messages" aria-label="Riwayat pesan ticket">
        {messages.length === 0 ? <div className="empty-state">Tidak ada pesan yang tersimpan.</div> : null}
        {messages.map((message) => {
          const author = message.author ?? { username: "unknown", display_name: "Unknown User", bot: false };
          const displayName = textValue(author.display_name || author.username, "Unknown User");
          const initial = Array.from(displayName)[0]?.toUpperCase() ?? "?";
          return (
            <article className="message-card" id={`message-${message.id}`} key={message.id}>
              {author.avatar_url ? (
                <img className="avatar" src={author.avatar_url} alt="" />
              ) : (
                <div className="avatar avatar-fallback">{initial}</div>
              )}
              <div className="message-body">
                {message.reply_to_id ? <a className="reply-reference" href={`#message-${message.reply_to_id}`}>Membalas pesan sebelumnya</a> : null}
                <div className="message-heading">
                  <strong>{displayName}</strong>
                  <span>@{textValue(author.username, "unknown")}</span>
                  {author.bot ? <span className="bot-badge">BOT</span> : null}
                  <time dateTime={message.timestamp}>{formatDate(message.timestamp)}</time>
                  {message.edited_at ? <span>(diedit)</span> : null}
                </div>
                {message.content ? <div className="message-content">{textValue(message.content)}</div> : null}
                {message.embeds?.map((embed, index) => <EmbedCard embed={embed} key={`${message.id}-embed-${index}`} />)}
                {message.attachments?.map((attachment) => {
                  const isImage = attachment.content_type?.startsWith("image/");
                  return (
                    <div className="attachment" key={attachment.id}>
                      {isImage ? (
                        <a href={attachment.url} target="_blank" rel="noreferrer">
                          <img src={attachment.proxy_url || attachment.url} alt={attachment.description || attachment.filename} />
                        </a>
                      ) : (
                        <a href={attachment.url} target="_blank" rel="noreferrer">File: {textValue(attachment.filename, "attachment")}</a>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>

      <footer className="page-footer">Wevermore transcript disimpan dalam gzip dan dilindungi URL bertanda tangan UAID.</footer>
    </main>
  );
}
