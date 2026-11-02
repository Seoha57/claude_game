// art.ts에서 쓰는 SVG 조각 헬퍼 — 데이터 파일을 나누면서 공용으로 뺐다.
export const C = (parts: string) =>
  `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${parts}</svg>`;
export const Cy = (dy: number, parts: string) =>
  `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0,${dy})">${parts}</g></svg>`;
export const p = (d: string, f: string) => `<path d="${d}" fill="${f}"/>`;
export const ci = (cx: number, cy: number, r: number, f: string) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"/>`;
export const rc = (x: number, y: number, w: number, h: number, f: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
