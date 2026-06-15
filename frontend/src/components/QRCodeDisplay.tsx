interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export default function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=efefef&bgcolor=162936&margin=2`;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-card)", border: "2px solid var(--bg-muted)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="QR Code d'invitation" width={size} height={size} />
    </div>
  );
}
