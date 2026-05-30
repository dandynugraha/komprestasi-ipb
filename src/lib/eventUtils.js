export function encodeDescription(text, imageUrl, gformUrl) {
  const parts = [];
  if (imageUrl) parts.push(`[IMAGE:${imageUrl}]`);
  if (gformUrl) parts.push(`[GFORM:${gformUrl}]`);
  if (text) parts.push(text);
  return parts.join("\n") || null;
}

export function parseDescription(raw) {
  if (!raw) return { imageUrl: null, gformUrl: null, text: "" };
  const lines = raw.split("\n");
  let imageUrl = null, gformUrl = null;
  const textLines = [];
  for (const line of lines) {
    const imgMatch = line.match(/^\[IMAGE:(.*)\]$/);
    const gformMatch = line.match(/^\[GFORM:(.*)\]$/);
    if (imgMatch) imageUrl = imgMatch[1];
    else if (gformMatch) gformUrl = gformMatch[1];
    else textLines.push(line);
  }
  return { imageUrl, gformUrl, text: textLines.join("\n").trim() };
}
