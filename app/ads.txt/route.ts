export function GET() {
  const body = "google.com, pub-2456404542897668, DIRECT, f08c47fec0942fa0\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
