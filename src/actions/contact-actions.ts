"use server";

import {
  parseContactFormData,
  submitContact,
  type ContactSubmitResult,
} from "@/services/contact";

export async function submitContactAction(
  _prev: ContactSubmitResult | undefined,
  formData: FormData,
): Promise<ContactSubmitResult> {
  const parsed = parseContactFormData(formData);
  if ("error" in parsed || "ok" in parsed) {
    return parsed;
  }

  return submitContact(parsed);
}
