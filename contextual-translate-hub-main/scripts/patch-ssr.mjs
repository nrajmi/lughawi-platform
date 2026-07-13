import fs from 'fs';
import path from 'path';

const ssrPath = path.resolve('.vercel/output/functions/__server.func/_ssr/ssr.mjs');

if (fs.existsSync(ssrPath)) {
  let content = fs.readFileSync(ssrPath, 'utf8');
  
  // Patch normalizeCatastrophicSsrResponse
  content = content.replace(
    'console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));\n\treturn new Response(renderErrorPage(), {',
    'const actualError = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);\n\tconsole.error(actualError);\n\treturn new Response(String(actualError.stack || actualError) + renderErrorPage(), {'
  );

  // Patch server_default fetch catch block
  content = content.replace(
    'console.error(error);\n\t\treturn new Response(renderErrorPage(), {',
    'console.error(error);\n\t\treturn new Response("<pre style=\\"color:red;padding:20px;background:black\\">" + String(error.stack || error) + "</pre>" + renderErrorPage(), {'
  );

  fs.writeFileSync(ssrPath, content, 'utf8');
  console.log('Successfully patched ssr.mjs to display errors on Vercel.');
} else {
  console.log('ssr.mjs not found, skipping patch.');
}
