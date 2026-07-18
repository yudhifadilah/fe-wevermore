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

function EmbedCard({ embed }: { embed: DiscordEmbed }) {
  const borderColor = embed.color ? `#${embed.color.toString(16).padStart(6, "0")}` : "#5865f2";
  return (
    <section className="discord-embed" style={{ borderLeftColor: borderColor }}>
      {embed.author?.name ? <div className="embed-author">{embed.author.name}</div> : null}
      {embed.title ? (
        embed.url ? <a href={embed.url} target="_blank" rel="noreferrer" className="embed-title">{embed.title}</a> : <div className="embed-title">{embed.title}</div>
      ) : null}
      {embed.description ? <div className="message-content">{embed.description}</div> : null}
      {embed.fields?.length ? (
        <div className="embed-fields">
          {embed.fields.map((field, index) => (
            <div className="embed-field" key={`${field.name}-${index}`}>
              <strong>{field.name}</strong>
              <div className="message-content">{field.value}</div>
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
  return (
    <main className="page-shell">
      <header className="transcript-header">
        <div className="header-topline">
          <div>
            <span className="eyebrow">{transcript.shop_name} • Ticket Transcript</span>
            <h1>#{transcript.channel_name}</h1>
          </div>
          <div className="download-actions">
            <a className="button primary" href={data.download_html_url}>Download HTML</a>
            <a className="button secondary" href={data.download_gzip_url}>Download JSON.GZ</a>
          </div>
        </div>

        <section className="metadata-grid">
          <div><span>Ticket ID</span><strong>{transcript.ticket_id}</strong></div>
          <div><span>Kategori</span><strong>{transcript.category}</strong></div>
          <div><span>Buyer</span><strong>{transcript.buyer_username}</strong></div>
          <div><span>Nominal</span><strong>{rupiahFormatter.format(transcript.amount)}</strong></div>
          <div><span>Dibuat</span><strong>{formatDate(transcript.created_at)}</strong></div>
          <div><span>Ditutup</span><strong>{formatDate(transcript.closed_at)}</strong></div>
          <div><span>Pesan</span><strong>{transcript.message_count.toLocaleString("id-ID")}</strong></div>
          <div><span>URL Kedaluwarsa</span><strong>{formatDate(data.expires_at)}</strong></div>
        </section>

        {transcript.close_note ? <div className="notice"><strong>Catatan penutupan:</strong> {transcript.close_note}</div> : null}
        {transcript.truncated ? <div className="notice warning">Batas pesan tercapai. Sebagian pesan paling lama mungkin tidak disertakan.</div> : null}
      </header>

      <section className="messages" aria-label="Riwayat pesan ticket">
        {transcript.messages.length === 0 ? <div className="empty-state">Tidak ada pesan yang tersimpan.</div> : null}
        {transcript.messages.map((message) => {
          const displayName = message.author.display_name || message.author.username || "Unknown User";
          const initial = Array.from(displayName)[0]?.toUpperCase() ?? "?";
          return (
            <article className="message-card" id={`message-${message.id}`} key={message.id}>
              {message.author.avatar_url ? (
                <img className="avatar" src={message.author.avatar_url} alt="" />
              ) : (
                <div className="avatar avatar-fallback">{initial}</div>
              )}
              <div className="message-body">
                {message.reply_to_id ? <a className="reply-reference" href={`#message-${message.reply_to_id}`}>↳ Membalas pesan sebelumnya</a> : null}
                <div className="message-heading">
                  <strong>{displayName}</strong>
                  <span>@{message.author.username}</span>
                  {message.author.bot ? <span className="bot-badge">BOT</span> : null}
                  <time dateTime={message.timestamp}>{formatDate(message.timestamp)}</time>
                  {message.edited_at ? <span>(diedit)</span> : null}
                </div>
                {message.content ? <div className="message-content">{message.content}</div> : null}
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
                        <a href={attachment.url} target="_blank" rel="noreferrer">📎 {attachment.filename}</a>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>

      <footer className="page-footer">Transcript disimpan dalam gzip dan dilindungi URL bertanda tangan UAID.</footer>
    </main>
  );
}
