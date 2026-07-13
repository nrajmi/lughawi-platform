import handler from './.vercel/output/functions/__server.func/index.mjs';
const req = new Request('http://localhost/');
try {
  const res = await handler.fetch(req, {});
  console.log('Status:', res.status);
  console.log('Headers:', Object.fromEntries(res.headers.entries()));
  console.log('Body:', await res.text());
} catch (err) {
  console.error('Crash:', err);
}
