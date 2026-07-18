import TranscriptView from "@/components/TranscriptView";
import type { TranscriptResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

function errorDetail(value: unknown, fallback: string) {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const record = value as { message?: unknown; code?: unknown; error?: unknown };
    if (typeof record.message === "string") {
      return typeof record.code === "string" ? `${record.message} (${record.code})` : record.message;
    }
    if (typeof record.error === "string") return record.error;
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }
  return String(value);
}

export default async function TranscriptPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const uaid = first(query.uaid);
  const exp = first(query.exp);
  const sig = first(query.sig);
  const backend = (process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

  if (!backend || !id || !uaid || !exp || !sig) {
    return <ErrorState title="URL transcript tidak lengkap" detail="Pastikan Anda membuka URL asli yang dikirim oleh bot Wevermore." />;
  }

  const tokenQuery = new URLSearchParams({ uaid, exp, sig });
  let response: Response;
  try {
    response = await fetch(`${backend}/api/v1/transcripts/${encodeURIComponent(id)}?${tokenQuery.toString()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch {
    return <ErrorState title="Backend transcript tidak dapat dihubungi" detail="Periksa konfigurasi BACKEND_INTERNAL_URL atau status hosting backend." />;
  }

  if (!response.ok) {
    let detail = `Backend mengembalikan HTTP ${response.status}.`;
    try {
      const body = (await response.json()) as { error?: unknown; message?: unknown; code?: unknown };
      detail = errorDetail(body.error ?? body, detail);
    } catch {
      // Gunakan pesan status standar.
    }
    return <ErrorState title={response.status === 410 ? "Transcript sudah kedaluwarsa" : "Transcript tidak dapat dibuka"} detail={detail} />;
  }

  const data = (await response.json()) as TranscriptResponse;
  return <TranscriptView data={data} />;
}

function ErrorState({ title, detail }: { title: string; detail: string }) {
  return (
    <main className="landing-shell">
      <section className="landing-card error-card">
        <img className="brand-logo hero-logo" src="/wevermore-logo.png" alt="Wevermore logo" />
        <span className="eyebrow">WEVERMORE TRANSCRIPT</span>
        <h1>{title}</h1>
        <p>{detail}</p>
      </section>
    </main>
  );
}
