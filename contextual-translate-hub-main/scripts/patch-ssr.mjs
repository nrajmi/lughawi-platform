import fs from 'fs';
import path from 'path';

const ssrPath = path.resolve('.vercel/output/functions/__server.func/_ssr/ssr.mjs');

if (fs.existsSync(ssrPath)) {
  let content = fs.readFileSync(ssrPath, 'utf8');
  
  // Replace both instances using Regex to ignore whitespaces and line endings
  content = content.replace(
    /return new Response\(renderErrorPage\(\),\s*\{/g,
    'return new Response("<pre style=\\"color:red;padding:20px;background:black;white-space:pre-wrap;z-index:9999;position:relative\\">" + String(typeof error !== "undefined" ? (error.stack || error) : (typeof actualError !== "undefined" ? (actualError.stack || actualError) : "Unknown Error")) + "</pre>" + renderErrorPage(), {'
  );

  fs.writeFileSync(ssrPath, content, 'utf8');
  console.log('Successfully patched ssr.mjs with REGEX to display errors on Vercel.');
} else {
  console.log('ssr.mjs not found, skipping patch.');
}
