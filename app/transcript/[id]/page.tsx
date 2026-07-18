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

export default async function TranscriptPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const uaid = first(query.uaid);
  const exp = first(query.exp);
  const sig = first(query.sig);
  const backend = (process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

  if (!backend || !id || !uaid || !exp || !sig) {
    return <ErrorState title="URL transcript tidak lengkap" detail="Pastikan Anda membuka URL asli yang dikirim oleh bot Fyneeds." />;
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
      const body = (await response.json()) as { error?: string };
      if (body.error) detail = body.error;
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
        <span className="eyebrow">FYNEEDS TRANSCRIPT</span>
        <h1>{title}</h1>
        <p>{detail}</p>
      </section>
    </main>
  );
}
