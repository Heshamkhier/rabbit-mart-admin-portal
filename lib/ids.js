// Job/store ids come straight from the Google Sheet, so they can contain
// spaces or Arabic (e.g. "Store Picker"). In a URL those arrive
// percent-encoded ("Store%20Picker") and this Next.js version passes the
// param through undecoded - which is why editing that job showed a 404.
export function idFromParam(raw) {
  try {
    return decodeURIComponent(String(raw));
  } catch {
    return String(raw);
  }
}

export function idToPath(id) {
  return encodeURIComponent(String(id));
}
