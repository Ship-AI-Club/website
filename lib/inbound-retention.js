// Resend Free, Pro and Scale retain email bodies for 30 days.
export const INBOUND_RETENTION_DAYS = 30;

export function canFetchInboundBody(receivedAt, now = Date.now()) {
  const received = new Date(receivedAt).getTime();
  return Number.isFinite(received) && received > now - INBOUND_RETENTION_DAYS * 86_400_000;
}
