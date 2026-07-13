import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    console.error("SSR CRASH CAUGHT BY ERROR MIDDLEWARE:", error);
    return new Response(
      "<pre style=\"color:red;padding:20px;background:black;white-space:pre-wrap;font-size:14px;position:relative;z-index:9999\">SSR CRASH: " + String((error as any)?.stack || error) + "</pre>" + renderErrorPage(),
      {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }
    );
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
