/** Detection of secrets in settings keys and in free text; shared by every export format. */

const SECRET_KEY = /password|passwd|passphrase|secret|token|api[-_]?key|private[-_]?key|credential|authorization|^pwd$|^pin$/i;

/** a settings key whose value must never leave the system */
export function isSecretKey(key: string) { return SECRET_KEY.test(key); }

const SUSPICIOUS_TEXT: RegExp[] = [
  /\b(password|passwd|pwd|secret|token|api[-_]?key)\s*[=:]\s*["']?[^\s"',;)}]{3,}/i,
  /\bBearer\s+[A-Za-z0-9\-._~+/]{8,}/,
  /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]+@/i,
];

/** free text that looks like it carries a password (`password=…`, `token: …`, `Bearer …`, `user:pw@host`) */
export function looksLikeSecret(text: string) {
  return SUSPICIOUS_TEXT.some((re) => re.test(text));
}
