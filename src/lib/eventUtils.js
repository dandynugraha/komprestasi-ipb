export function encodeDescription(text, imageUrl, gformUrl, speakerName) {
  const parts = [];
  if (imageUrl) parts.push(`[IMAGE:${imageUrl}]`);
  if (speakerName) parts.push(`[SPEAKER:${speakerName}]`);
  if (gformUrl) parts.push(`[GFORM:${gformUrl}]`);
  if (text) parts.push(text);
  return parts.join("\n") || null;
}

export function parseDescription(raw) {
  if (!raw) return { imageUrl: null, gformUrl: null, speakerName: null, text: "" };
  const lines = raw.split("\n");
  let imageUrl = null, gformUrl = null, speakerName = null;
  const textLines = [];
  for (const line of lines) {
    const imgMatch = line.match(/^\[IMAGE:(.*)\]$/);
    const gformMatch = line.match(/^\[GFORM:(.*)\]$/);
    const speakerMatch = line.match(/^\[SPEAKER:(.*)\]$/);
    if (imgMatch) imageUrl = imgMatch[1];
    else if (gformMatch) gformUrl = gformMatch[1];
    else if (speakerMatch) speakerName = speakerMatch[1];
    else textLines.push(line);
  }
  return { imageUrl, gformUrl, speakerName, text: textLines.join("\n").trim() };
}
