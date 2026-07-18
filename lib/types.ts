export type TranscriptResponse = {
  transcript: TranscriptDocument;
  expires_at: string;
  download_html_url: string;
  download_gzip_url: string;
};

export type TranscriptDocument = {
  version: number;
  shop_name: string;
  ticket_id: string;
  guild_id: string;
  channel_id: string;
  channel_name: string;
  buyer_id: string;
  buyer_username: string;
  category: string;
  created_at: string;
  closed_at: string;
  closed_by: string;
  amount: number;
  close_note?: string;
  message_count: number;
  truncated: boolean;
  messages: TranscriptMessage[];
};

export type TranscriptMessage = {
  id: string;
  type: number;
  author: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
    bot: boolean;
  };
  content: string;
  timestamp: string;
  edited_at?: string;
  reply_to_id?: string;
  attachments?: Attachment[];
  embeds?: DiscordEmbed[];
};

export type Attachment = {
  id: string;
  filename: string;
  description?: string;
  content_type?: string;
  url: string;
  proxy_url?: string;
  size: number;
  width?: number;
  height?: number;
};

export type DiscordEmbed = {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  fields?: { name: string; value: string; inline: boolean }[];
  thumbnail?: { url?: string; proxy_url?: string; width?: number; height?: number };
  image?: { url?: string; proxy_url?: string; width?: number; height?: number };
  footer?: { text?: string; icon_url?: string };
  author?: { name?: string; url?: string; icon_url?: string };
};
