export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function exactKeys<K extends string>(
  value: unknown,
  keys: K[],
): value is Record<K, unknown> {
  return (
    isRecord(value) &&
    Object.keys(value).length === keys.length &&
    keys.every((key) => Object.hasOwn(value, key))
  );
}

export function plainText(value: unknown): value is string {
  return typeof value === "string" && !!value.trim() && !/[<>\r\n]/.test(value);
}

export function isContentLink(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^(?:\/(?!\/)[a-z0-9/#?=&._%-]*|#[a-z][a-z0-9-]*|https:\/\/[^\s<>"']+|mailto:[^\s<>"']+)$/i.test(
      value,
    )
  );
}
