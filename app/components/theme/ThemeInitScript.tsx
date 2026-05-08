import { type ReactNode } from "react";
import { THEME_STORAGE_KEY } from "@/context/theme-constants";

const THEME_INIT_JS = `(function(){try{var k='${THEME_STORAGE_KEY}',m=localStorage.getItem(k);if(m!=='light'&&m!=='dark'&&m!=='system')m='system';var r=document.documentElement;var dark=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);r.classList.toggle('dark',dark);r.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;

/**
 * Sets `html.dark` before first paint to avoid light->dark flicker.
 * This intentionally uses localStorage, so we can’t fully avoid client bootstrap.
 */
export function ThemeInitScript(): ReactNode {
  return (
    <script
      // Executed before first paint to avoid light->dark flicker.
      dangerouslySetInnerHTML={{ __html: THEME_INIT_JS }}
    />
  );
}

