// SVG inner content for tiles that use SVG rendering.
// Used with dangerouslySetInnerHTML on an <svg width="68" height="90" viewBox="0 0 68 90"> element.
export const TILE_SVG_INNER: Record<string, string> = {

  // ── Dots ──────────────────────────────────────────────────────────────────
  'dots-1': `
  <circle cx="34" cy="45" r="26" fill="#1a7a3c"/>
  <circle cx="34" cy="45" r="20" fill="#1a5fa8"/>
  <circle cx="34" cy="45" r="13" fill="#d43a2f"/>
  <circle cx="34" cy="45" r="6" fill="#fff" opacity="0.25"/>
  <circle cx="30" cy="41" r="2.5" fill="#fff" opacity="0.4"/>`,

  'dots-2': `
  <circle cx="34" cy="27" r="11" fill="#1a7a3c"/><circle cx="34" cy="27" r="5.5" fill="#fff" opacity="0.22"/><circle cx="31" cy="24" r="1.7" fill="#fff" opacity="0.38"/>
  <circle cx="34" cy="63" r="11" fill="#1a5fa8"/><circle cx="34" cy="63" r="5.5" fill="#fff" opacity="0.22"/><circle cx="31" cy="60" r="1.7" fill="#fff" opacity="0.38"/>`,

  'dots-3': `
  <circle cx="20" cy="22" r="10" fill="#d43a2f"/><circle cx="20" cy="22" r="5" fill="#fff" opacity="0.22"/><circle cx="17" cy="19" r="1.5" fill="#fff" opacity="0.38"/>
  <circle cx="34" cy="45" r="10" fill="#1a7a3c"/><circle cx="34" cy="45" r="5" fill="#fff" opacity="0.22"/><circle cx="31" cy="42" r="1.5" fill="#fff" opacity="0.38"/>
  <circle cx="48" cy="68" r="10" fill="#1a5fa8"/><circle cx="48" cy="68" r="5" fill="#fff" opacity="0.22"/><circle cx="45" cy="65" r="1.5" fill="#fff" opacity="0.38"/>`,

  'dots-4': `
  <circle cx="20" cy="25" r="10" fill="#1a5fa8"/><circle cx="20" cy="25" r="5" fill="#fff" opacity="0.22"/><circle cx="17" cy="22" r="1.5" fill="#fff" opacity="0.38"/>
  <circle cx="48" cy="25" r="10" fill="#1a7a3c"/><circle cx="48" cy="25" r="5" fill="#fff" opacity="0.22"/><circle cx="45" cy="22" r="1.5" fill="#fff" opacity="0.38"/>
  <circle cx="20" cy="65" r="10" fill="#1a7a3c"/><circle cx="20" cy="65" r="5" fill="#fff" opacity="0.22"/><circle cx="17" cy="62" r="1.5" fill="#fff" opacity="0.38"/>
  <circle cx="48" cy="65" r="10" fill="#1a5fa8"/><circle cx="48" cy="65" r="5" fill="#fff" opacity="0.22"/><circle cx="45" cy="62" r="1.5" fill="#fff" opacity="0.38"/>`,

  'dots-5': `
  <circle cx="20" cy="20" r="10" fill="#d43a2f"/><circle cx="20" cy="20" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="20" r="10" fill="#1a7a3c"/><circle cx="48" cy="20" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="34" cy="45" r="10" fill="#1a5fa8"/><circle cx="34" cy="45" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="20" cy="70" r="10" fill="#1a7a3c"/><circle cx="20" cy="70" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="70" r="10" fill="#d43a2f"/><circle cx="48" cy="70" r="5" fill="#fff" opacity="0.22"/>`,

  'dots-6': `
  <circle cx="20" cy="20" r="10" fill="#1a7a3c"/><circle cx="20" cy="20" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="20" r="10" fill="#1a7a3c"/><circle cx="48" cy="20" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="20" cy="45" r="10" fill="#d43a2f"/><circle cx="20" cy="45" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="45" r="10" fill="#d43a2f"/><circle cx="48" cy="45" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="20" cy="70" r="10" fill="#d43a2f"/><circle cx="20" cy="70" r="5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="70" r="10" fill="#d43a2f"/><circle cx="48" cy="70" r="5" fill="#fff" opacity="0.22"/>`,

  'dots-7': `
  <circle cx="15" cy="12" r="9" fill="#1a7a3c"/><circle cx="15" cy="12" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="34" cy="22" r="9" fill="#1a7a3c"/><circle cx="34" cy="22" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="53" cy="12" r="9" fill="#1a7a3c"/><circle cx="53" cy="12" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="20" cy="49" r="9" fill="#d43a2f"/><circle cx="20" cy="49" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="49" r="9" fill="#d43a2f"/><circle cx="48" cy="49" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="20" cy="74" r="9" fill="#d43a2f"/><circle cx="20" cy="74" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="74" r="9" fill="#d43a2f"/><circle cx="48" cy="74" r="4.5" fill="#fff" opacity="0.22"/>`,

  'dots-8': `
  <circle cx="20" cy="14" r="9" fill="#1a5fa8"/><circle cx="20" cy="14" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="14" r="9" fill="#1a5fa8"/><circle cx="48" cy="14" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="20" cy="35" r="9" fill="#1a5fa8"/><circle cx="20" cy="35" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="35" r="9" fill="#1a5fa8"/><circle cx="48" cy="35" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="20" cy="56" r="9" fill="#1a5fa8"/><circle cx="20" cy="56" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="56" r="9" fill="#1a5fa8"/><circle cx="48" cy="56" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="20" cy="77" r="9" fill="#1a5fa8"/><circle cx="20" cy="77" r="4.5" fill="#fff" opacity="0.22"/>
  <circle cx="48" cy="77" r="9" fill="#1a5fa8"/><circle cx="48" cy="77" r="4.5" fill="#fff" opacity="0.22"/>`,

  'dots-9': `
  <circle cx="16" cy="13" r="8" fill="#1a7a3c"/><circle cx="16" cy="13" r="4" fill="#fff" opacity="0.22"/>
  <circle cx="34" cy="13" r="8" fill="#1a7a3c"/><circle cx="34" cy="13" r="4" fill="#fff" opacity="0.22"/>
  <circle cx="52" cy="13" r="8" fill="#1a7a3c"/><circle cx="52" cy="13" r="4" fill="#fff" opacity="0.22"/>
  <circle cx="16" cy="45" r="8" fill="#d43a2f"/><circle cx="16" cy="45" r="4" fill="#fff" opacity="0.22"/>
  <circle cx="34" cy="45" r="8" fill="#d43a2f"/><circle cx="34" cy="45" r="4" fill="#fff" opacity="0.22"/>
  <circle cx="52" cy="45" r="8" fill="#d43a2f"/><circle cx="52" cy="45" r="4" fill="#fff" opacity="0.22"/>
  <circle cx="16" cy="77" r="8" fill="#1a5fa8"/><circle cx="16" cy="77" r="4" fill="#fff" opacity="0.22"/>
  <circle cx="34" cy="77" r="8" fill="#1a5fa8"/><circle cx="34" cy="77" r="4" fill="#fff" opacity="0.22"/>
  <circle cx="52" cy="77" r="8" fill="#1a5fa8"/><circle cx="52" cy="77" r="4" fill="#fff" opacity="0.22"/>`,

  // ── Bamboo ────────────────────────────────────────────────────────────────
  'bamboo-1': `
  <rect x="28" y="9" width="12" height="72" rx="6" fill="#1a7a3c"/>
  <rect x="26" y="27" width="16" height="5" rx="2" fill="#145e2e"/>
  <rect x="26" y="52" width="16" height="5" rx="2" fill="#145e2e"/>`,

  'bamboo-2': `
  <rect x="30" y="9" width="8" height="32" rx="4" fill="#1a7a3c"/>
  <rect x="28" y="21" width="12" height="4" rx="2" fill="#145e2e"/>
  <rect x="30" y="49" width="8" height="32" rx="4" fill="#1a7a3c"/>
  <rect x="28" y="61" width="12" height="4" rx="2" fill="#145e2e"/>`,

  'bamboo-3': `
  <rect x="30" y="8" width="8" height="32" rx="4" fill="#1a5fa8"/>
  <rect x="28" y="20" width="12" height="4" rx="2" fill="#0e3d6e"/>
  <rect x="16" y="50" width="8" height="32" rx="4" fill="#1a7a3c"/>
  <rect x="14" y="62" width="12" height="4" rx="2" fill="#145e2e"/>
  <rect x="44" y="50" width="8" height="32" rx="4" fill="#1a7a3c"/>
  <rect x="42" y="62" width="12" height="4" rx="2" fill="#145e2e"/>`,

  'bamboo-4': `
  <rect x="18" y="9" width="8" height="32" rx="4" fill="#1a5fa8"/>
  <rect x="16" y="21" width="12" height="3.5" rx="1.5" fill="#0e3d6e"/>
  <rect x="42" y="9" width="8" height="32" rx="4" fill="#1a7a3c"/>
  <rect x="40" y="21" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="18" y="49" width="8" height="32" rx="4" fill="#1a7a3c"/>
  <rect x="16" y="61" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="42" y="49" width="8" height="32" rx="4" fill="#1a5fa8"/>
  <rect x="40" y="61" width="12" height="3.5" rx="1.5" fill="#0e3d6e"/>`,

  'bamboo-5': `
  <rect x="11" y="9" width="8" height="32" rx="4" fill="#1a5fa8"/>
  <rect x="9" y="21" width="12" height="3.5" rx="1.5" fill="#0e3d6e"/>
  <rect x="11" y="49" width="8" height="32" rx="4" fill="#1a7a3c"/>
  <rect x="9" y="61" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="30" y="29" width="8" height="32" rx="4" fill="#d43a2f"/>
  <rect x="28" y="41" width="12" height="3.5" rx="1.5" fill="#8b1a1a"/>
  <rect x="49" y="9" width="8" height="32" rx="4" fill="#1a7a3c"/>
  <rect x="47" y="21" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="49" y="49" width="8" height="32" rx="4" fill="#1a5fa8"/>
  <rect x="47" y="61" width="12" height="3.5" rx="1.5" fill="#0e3d6e"/>`,

  'bamboo-6': `
  <rect x="11" y="9" width="8" height="32" rx="4" fill="#1a7a3c"/><rect x="9" y="21" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="11" y="49" width="8" height="32" rx="4" fill="#1a7a3c"/><rect x="9" y="61" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="30" y="9" width="8" height="32" rx="4" fill="#1a7a3c"/><rect x="28" y="21" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="30" y="49" width="8" height="32" rx="4" fill="#1a7a3c"/><rect x="28" y="61" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="49" y="9" width="8" height="32" rx="4" fill="#1a7a3c"/><rect x="47" y="21" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="49" y="49" width="8" height="32" rx="4" fill="#1a7a3c"/><rect x="47" y="61" width="12" height="3.5" rx="1.5" fill="#145e2e"/>`,

  'bamboo-7': `
  <rect x="30" y="12" width="8" height="19" rx="4" fill="#d43a2f"/><rect x="28" y="18" width="12" height="3.5" rx="1.5" fill="#8b1a1a"/>
  <rect x="11" y="35" width="8" height="19" rx="4" fill="#1a7a3c"/><rect x="9" y="41" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="30" y="35" width="8" height="19" rx="4" fill="#1a5fa8"/><rect x="28" y="41" width="12" height="3.5" rx="1.5" fill="#0e3d6e"/>
  <rect x="49" y="35" width="8" height="19" rx="4" fill="#1a7a3c"/><rect x="47" y="41" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="11" y="58" width="8" height="19" rx="4" fill="#1a7a3c"/><rect x="9" y="64" width="12" height="3.5" rx="1.5" fill="#145e2e"/>
  <rect x="30" y="58" width="8" height="19" rx="4" fill="#1a5fa8"/><rect x="28" y="64" width="12" height="3.5" rx="1.5" fill="#0e3d6e"/>
  <rect x="49" y="58" width="8" height="19" rx="4" fill="#1a7a3c"/><rect x="47" y="64" width="12" height="3.5" rx="1.5" fill="#145e2e"/>`,

  'bamboo-8': `
  <rect x="8" y="8" width="6" height="36" rx="3" fill="#1a7a3c"/><rect x="6.5" y="20" width="9" height="3" rx="1.5" fill="#145e2e"/>
  <rect x="54" y="8" width="6" height="36" rx="3" fill="#1a7a3c"/><rect x="52.5" y="20" width="9" height="3" rx="1.5" fill="#145e2e"/>
  <line x1="11" y1="10" x2="34" y2="36" stroke="#1a7a3c" stroke-width="5" stroke-linecap="round"/>
  <line x1="57" y1="10" x2="34" y2="36" stroke="#1a7a3c" stroke-width="5" stroke-linecap="round"/>
  <rect x="8" y="46" width="6" height="36" rx="3" fill="#d43a2f"/><rect x="6.5" y="58" width="9" height="3" rx="1.5" fill="#8b1a1a"/>
  <rect x="54" y="46" width="6" height="36" rx="3" fill="#d43a2f"/><rect x="52.5" y="58" width="9" height="3" rx="1.5" fill="#8b1a1a"/>
  <line x1="11" y1="80" x2="34" y2="54" stroke="#d43a2f" stroke-width="5" stroke-linecap="round"/>
  <line x1="57" y1="80" x2="34" y2="54" stroke="#d43a2f" stroke-width="5" stroke-linecap="round"/>`,

  'bamboo-9': `
  <rect x="11" y="9" width="7" height="22" rx="3.5" fill="#d43a2f"/><rect x="9.5" y="17" width="10" height="3" rx="1.5" fill="#8b1a1a"/>
  <rect x="30" y="9" width="7" height="22" rx="3.5" fill="#1a7a3c"/><rect x="28.5" y="17" width="10" height="3" rx="1.5" fill="#145e2e"/>
  <rect x="49" y="9" width="7" height="22" rx="3.5" fill="#1a5fa8"/><rect x="47.5" y="17" width="10" height="3" rx="1.5" fill="#0e3d6e"/>
  <rect x="11" y="34" width="7" height="22" rx="3.5" fill="#d43a2f"/><rect x="9.5" y="42" width="10" height="3" rx="1.5" fill="#8b1a1a"/>
  <rect x="30" y="34" width="7" height="22" rx="3.5" fill="#1a7a3c"/><rect x="28.5" y="42" width="10" height="3" rx="1.5" fill="#145e2e"/>
  <rect x="49" y="34" width="7" height="22" rx="3.5" fill="#1a5fa8"/><rect x="47.5" y="42" width="10" height="3" rx="1.5" fill="#0e3d6e"/>
  <rect x="11" y="59" width="7" height="22" rx="3.5" fill="#d43a2f"/><rect x="9.5" y="67" width="10" height="3" rx="1.5" fill="#8b1a1a"/>
  <rect x="30" y="59" width="7" height="22" rx="3.5" fill="#1a7a3c"/><rect x="28.5" y="67" width="10" height="3" rx="1.5" fill="#145e2e"/>
  <rect x="49" y="59" width="7" height="22" rx="3.5" fill="#1a5fa8"/><rect x="47.5" y="67" width="10" height="3" rx="1.5" fill="#0e3d6e"/>`,

  // ── Dragons (White only — Red/Green use text rendering) ───────────────────
  'dragons-white': `
  <rect x="7" y="8" width="54" height="74" rx="5" fill="none" stroke="#1a5fa8" stroke-width="3"/>
  <rect x="12" y="13" width="44" height="64" rx="3" fill="none" stroke="#1a5fa8" stroke-width="1.5"/>
  <line x1="7" y1="17" x2="12" y2="17" stroke="#1a5fa8" stroke-width="2"/>
  <line x1="16" y1="8" x2="16" y2="13" stroke="#1a5fa8" stroke-width="2"/>
  <line x1="61" y1="17" x2="56" y2="17" stroke="#1a5fa8" stroke-width="2"/>
  <line x1="52" y1="8" x2="52" y2="13" stroke="#1a5fa8" stroke-width="2"/>
  <line x1="7" y1="73" x2="12" y2="73" stroke="#1a5fa8" stroke-width="2"/>
  <line x1="16" y1="82" x2="16" y2="77" stroke="#1a5fa8" stroke-width="2"/>
  <line x1="61" y1="73" x2="56" y2="73" stroke="#1a5fa8" stroke-width="2"/>
  <line x1="52" y1="82" x2="52" y2="77" stroke="#1a5fa8" stroke-width="2"/>`,

  // ── Flowers ───────────────────────────────────────────────────────────────
  'flowers-plum': `
  <line x1="34" y1="78" x2="34" y2="52" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <line x1="34" y1="70" x2="18" y2="58" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <line x1="34" y1="64" x2="50" y2="54" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="13" cy="54" rx="11" ry="6" fill="none" stroke="#1a7a3c" stroke-width="2.5" transform="rotate(-35 13 54)"/>
  <ellipse cx="55" cy="50" rx="11" ry="6" fill="none" stroke="#1a7a3c" stroke-width="2.5" transform="rotate(35 55 50)"/>
  <circle cx="34" cy="40" r="7" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="22" cy="34" r="7" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="46" cy="34" r="7" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="24" cy="47" r="7" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="44" cy="47" r="7" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="34" cy="40" r="3.5" fill="#d43a2f"/>
  <text x="34" y="88" font-size="8" font-weight="700" fill="#1a5fa8" font-family="sans-serif" text-anchor="middle">PLUM</text>`,

  'flowers-orchid': `
  <path d="M34 78 Q20 60 14 30" fill="none" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <path d="M34 78 Q48 58 54 28" fill="none" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <path d="M34 78 Q28 52 22 18" fill="none" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <path d="M34 78 Q40 55 46 22" fill="none" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <path d="M34 78 Q34 50 34 14" fill="none" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <circle cx="22" cy="52" r="6" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="14" cy="48" r="5" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="18" cy="42" r="5" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="28" cy="44" r="5" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="30" cy="54" r="5" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="22" cy="50" r="3" fill="#d43a2f"/>
  <text x="34" y="88" font-size="8" font-weight="700" fill="#1a5fa8" font-family="sans-serif" text-anchor="middle">ORCHID</text>`,

  'flowers-chrysanthemum': `
  <line x1="34" y1="80" x2="34" y2="58" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <path d="M34 72 Q18 68 10 60" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M34 72 Q50 68 58 60" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M34 65 Q16 62 8 52" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M34 65 Q52 62 60 52" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="11" cy="58" rx="6" ry="3.5" fill="#1a7a3c" transform="rotate(-30 11 58)"/>
  <ellipse cx="57" cy="58" rx="6" ry="3.5" fill="#1a7a3c" transform="rotate(30 57 58)"/>
  <ellipse cx="9" cy="50" rx="6" ry="3.5" fill="#1a7a3c" transform="rotate(-40 9 50)"/>
  <ellipse cx="59" cy="50" rx="6" ry="3.5" fill="#1a7a3c" transform="rotate(40 59 50)"/>
  <path d="M34 58 Q24 46 26 34" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M34 58 Q44 46 42 34" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="26" cy="32" rx="5" ry="3" fill="#1a7a3c" transform="rotate(-20 26 32)"/>
  <ellipse cx="42" cy="32" rx="5" ry="3" fill="#1a7a3c" transform="rotate(20 42 32)"/>
  <ellipse cx="34" cy="34" rx="3" ry="10" fill="#fde8e8" stroke="#d43a2f" stroke-width="2" transform="rotate(0 34 34)"/>
  <ellipse cx="34" cy="34" rx="3" ry="10" fill="#fde8e8" stroke="#d43a2f" stroke-width="2" transform="rotate(30 34 34)"/>
  <ellipse cx="34" cy="34" rx="3" ry="10" fill="#fde8e8" stroke="#d43a2f" stroke-width="2" transform="rotate(60 34 34)"/>
  <ellipse cx="34" cy="34" rx="3" ry="10" fill="#fde8e8" stroke="#d43a2f" stroke-width="2" transform="rotate(90 34 34)"/>
  <ellipse cx="34" cy="34" rx="3" ry="10" fill="#fde8e8" stroke="#d43a2f" stroke-width="2" transform="rotate(120 34 34)"/>
  <ellipse cx="34" cy="34" rx="3" ry="10" fill="#fde8e8" stroke="#d43a2f" stroke-width="2" transform="rotate(150 34 34)"/>
  <circle cx="34" cy="34" r="4.5" fill="#d43a2f"/>
  <text x="34" y="88" font-size="8" font-weight="700" fill="#1a5fa8" font-family="sans-serif" text-anchor="middle">CHRYS.</text>`,

  'flowers-bamboo': `
  <rect x="22" y="18" width="8" height="58" rx="4" fill="none" stroke="#1a7a3c" stroke-width="2.5"/>
  <rect x="20" y="33" width="12" height="4" rx="2" fill="none" stroke="#1a7a3c" stroke-width="2"/>
  <rect x="20" y="52" width="12" height="4" rx="2" fill="none" stroke="#1a7a3c" stroke-width="2"/>
  <rect x="38" y="28" width="8" height="48" rx="4" fill="none" stroke="#1a7a3c" stroke-width="2.5"/>
  <rect x="36" y="43" width="12" height="4" rx="2" fill="none" stroke="#1a7a3c" stroke-width="2"/>
  <rect x="36" y="60" width="12" height="4" rx="2" fill="none" stroke="#1a7a3c" stroke-width="2"/>
  <path d="M22 22 Q10 14 8 6" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M22 22 Q14 10 18 4" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M46 32 Q58 22 60 12" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M46 32 Q54 20 52 10" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="34" cy="20" r="5" fill="#fde8e8" stroke="#d43a2f" stroke-width="2.5"/>
  <circle cx="27" cy="15" r="4" fill="#fde8e8" stroke="#d43a2f" stroke-width="2"/>
  <circle cx="41" cy="15" r="4" fill="#fde8e8" stroke="#d43a2f" stroke-width="2"/>
  <circle cx="34" cy="20" r="2.5" fill="#d43a2f"/>
  <text x="34" y="88" font-size="8" font-weight="700" fill="#1a5fa8" font-family="sans-serif" text-anchor="middle">BAMBOO</text>`,

  // ── Seasons ───────────────────────────────────────────────────────────────
  'seasons-spring': `
  <line x1="34" y1="78" x2="34" y2="52" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <path d="M34 68 Q20 62 16 50" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="13" cy="47" rx="9" ry="4.5" fill="#1a7a3c" transform="rotate(-40 13 47)"/>
  <path d="M34 68 Q48 62 52 50" fill="none" stroke="#1a7a3c" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="55" cy="47" rx="9" ry="4.5" fill="#1a7a3c" transform="rotate(40 55 47)"/>
  <path d="M34 52 Q24 46 23 34 Q28 26 34 30 Q40 26 45 34 Q44 46 34 52Z" fill="#d43a2f" stroke="#b02020" stroke-width="1.2"/>
  <path d="M27 50 Q14 44 15 30 Q22 20 30 28" fill="#d43a2f" stroke="#b02020" stroke-width="1.2"/>
  <path d="M41 50 Q54 44 53 30 Q46 20 38 28" fill="#d43a2f" stroke="#b02020" stroke-width="1.2"/>
  <line x1="34" y1="30" x2="34" y2="50" stroke="#b02020" stroke-width="1.2" stroke-linecap="round"/>
  <text x="34" y="88" font-size="8" font-weight="700" fill="#1a5fa8" font-family="sans-serif" text-anchor="middle">SPRING</text>`,

  'seasons-summer': `
  <line x1="34" y1="28" x2="34" y2="14" stroke="#d43a2f" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="34" y1="54" x2="34" y2="68" stroke="#d43a2f" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="21" y1="41" x2="7" y2="41" stroke="#d43a2f" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="47" y1="41" x2="61" y2="41" stroke="#d43a2f" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="25" y1="32" x2="15" y2="22" stroke="#d43a2f" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="43" y1="32" x2="53" y2="22" stroke="#d43a2f" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="25" y1="50" x2="15" y2="60" stroke="#d43a2f" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="43" y1="50" x2="53" y2="60" stroke="#d43a2f" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="34" cy="41" r="13" fill="#d43a2f"/>
  <circle cx="34" cy="41" r="8" fill="#f07060"/>
  <text x="34" y="88" font-size="8" font-weight="700" fill="#1a5fa8" font-family="sans-serif" text-anchor="middle">SUMMER</text>`,

  'seasons-autumn': `
  <path d="M34 16 L30 27 L20 23 L26 33 L10 37 L20 41 L14 53 L26 47 L24 60 L34 54 L44 60 L42 47 L54 53 L48 41 L58 37 L42 33 L48 23 L38 27 Z" fill="#1a7a3c" stroke="#145e2e" stroke-width="1.2" stroke-linejoin="round"/>
  <line x1="34" y1="54" x2="34" y2="22" stroke="#fff" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <line x1="34" y1="42" x2="20" y2="34" stroke="#fff" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
  <line x1="34" y1="42" x2="48" y2="34" stroke="#fff" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
  <line x1="34" y1="60" x2="34" y2="78" stroke="#1a7a3c" stroke-width="3" stroke-linecap="round"/>
  <text x="34" y="88" font-size="8" font-weight="700" fill="#1a5fa8" font-family="sans-serif" text-anchor="middle">AUTUMN</text>`,

  'seasons-winter': `
  <line x1="34" y1="12" x2="34" y2="70" stroke="#1a5fa8" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="8.4" y1="26" x2="59.6" y2="56" stroke="#1a5fa8" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="59.6" y1="26" x2="8.4" y2="56" stroke="#1a5fa8" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="34" y1="23" x2="26" y2="31" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="23" x2="42" y2="31" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="32" x2="28" y2="38" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="32" x2="40" y2="38" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="59" x2="26" y2="51" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="59" x2="42" y2="51" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="50" x2="28" y2="44" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="50" x2="40" y2="44" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="43" y1="27" x2="43" y2="35" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="43" y1="27" x2="51" y2="31" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="49" y1="31" x2="47" y2="39" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="49" y1="31" x2="57" y2="35" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="55" x2="25" y2="47" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="55" x2="17" y2="51" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="19" y1="51" x2="21" y2="43" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="19" y1="51" x2="11" y2="47" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="27" x2="25" y2="35" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="27" x2="17" y2="31" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="19" y1="31" x2="21" y2="39" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="19" y1="31" x2="11" y2="35" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="43" y1="55" x2="43" y2="47" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="43" y1="55" x2="51" y2="51" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="49" y1="51" x2="47" y2="43" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <line x1="49" y1="51" x2="57" y2="47" stroke="#1a5fa8" stroke-width="2" stroke-linecap="round"/>
  <circle cx="34" cy="41" r="4.5" fill="#1a5fa8"/>
  <text x="34" y="88" font-size="8" font-weight="700" fill="#1a5fa8" font-family="sans-serif" text-anchor="middle">WINTER</text>`,
}

// Text-based tile content (characters, winds, dragons red/green)
export interface TileTextContent {
  primary: string
  secondary?: string
  primaryColor: string
  secondaryColor?: string
  primarySize: number
  secondarySize?: number
}

export const TILE_TEXT_CONTENT: Record<string, TileTextContent> = {
  'characters-1': { primary: '一', secondary: '1', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'characters-2': { primary: '二', secondary: '2', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'characters-3': { primary: '三', secondary: '3', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'characters-4': { primary: '四', secondary: '4', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'characters-5': { primary: '五', secondary: '5', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'characters-6': { primary: '六', secondary: '6', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'characters-7': { primary: '七', secondary: '7', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'characters-8': { primary: '八', secondary: '8', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'characters-9': { primary: '九', secondary: '9', primaryColor: '#111', secondaryColor: '#d43a2f', primarySize: 32, secondarySize: 18 },
  'winds-east':  { primary: '東', secondary: 'East',  primaryColor: '#1a5fa8', secondaryColor: '#1a5fa8', primarySize: 34, secondarySize: 13 },
  'winds-south': { primary: '南', secondary: 'South', primaryColor: '#1a5fa8', secondaryColor: '#1a5fa8', primarySize: 34, secondarySize: 13 },
  'winds-west':  { primary: '西', secondary: 'West',  primaryColor: '#1a5fa8', secondaryColor: '#1a5fa8', primarySize: 34, secondarySize: 13 },
  'winds-north': { primary: '北', secondary: 'North', primaryColor: '#1a5fa8', secondaryColor: '#1a5fa8', primarySize: 34, secondarySize: 13 },
  'dragons-red':   { primary: '中', primaryColor: '#d43a2f', primarySize: 52 },
  'dragons-green': { primary: '發', primaryColor: '#1a7a3c', primarySize: 52 },
}
