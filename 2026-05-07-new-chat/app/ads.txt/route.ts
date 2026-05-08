export function GET() {
  const body = "google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
