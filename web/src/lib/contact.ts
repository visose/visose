import { exactKeys, isRecord, plainText } from "./validation.ts";

export interface ContactField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select";
  required: boolean;
  maxLength?: number;
  options?: string[];
  placeholder?: string;
  hint?: string;
  autocomplete?: string;
  error?: string;
}

export interface ContactFormDefinition {
  maxBodyBytes: number;
  form: ContactField[];
  optionalDetails: string;
  submit: string;
  success: string;
  error: string;
  sending: string;
  pending: string;
  invalidFields: string;
  invalid: string;
  tooLong: string;
}

export function readContactForm(value: unknown): ContactFormDefinition {
  const messages = [
    "optionalDetails",
    "submit",
    "success",
    "error",
    "sending",
    "pending",
    "invalidFields",
    "invalid",
    "tooLong",
  ];
  if (
    !exactKeys(value, ["maxBodyBytes", "form", ...messages]) ||
    !Number.isSafeInteger(value.maxBodyBytes) ||
    (value.maxBodyBytes as number) <= 0 ||
    !Array.isArray(value.form) ||
    !value.form.length ||
    !messages.every((key) => plainText(value[key])) ||
    !(value.tooLong as string).includes("{maxLength}")
  )
    throw new Error("Invalid contact form definition.");

  const names = new Set<string>();
  for (const field of value.form) {
    if (!isRecord(field)) throw new Error("Invalid contact field.");
    const keys = [
      "name",
      "label",
      "type",
      "required",
      ...(field.type === "select" ? ["options"] : ["maxLength"]),
      ...["hint", "placeholder", "error", "autocomplete"].filter(
        (key) => key in field,
      ),
    ];
    if (
      !exactKeys(field, keys) ||
      typeof field.name !== "string" ||
      !/^[a-z][a-z0-9-]*$/.test(field.name) ||
      names.has(field.name) ||
      !plainText(field.label) ||
      typeof field.required !== "boolean" ||
      !["text", "email", "textarea", "select"].includes(field.type as string) ||
      ("hint" in field && !plainText(field.hint)) ||
      ("placeholder" in field && !plainText(field.placeholder)) ||
      ("autocomplete" in field && !plainText(field.autocomplete)) ||
      (("error" in field ||
        field.required ||
        field.type === "email" ||
        field.type === "select") &&
        !plainText(field.error)) ||
      (field.type === "select"
        ? !("placeholder" in field) ||
          !Array.isArray(field.options) ||
          !field.options.length ||
          !field.options.every(plainText) ||
          new Set(field.options).size !== field.options.length
        : !Number.isSafeInteger(field.maxLength) ||
          (field.maxLength as number) <= 0)
    )
      throw new Error("Invalid contact field: " + field.name);
    names.add(field.name);
  }
  return value as unknown as ContactFormDefinition;
}
