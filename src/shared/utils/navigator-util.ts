function isNavigatorAvailable() {
  return typeof navigator !== "undefined";
}

export async function shareText(title: string, text: string): Promise<boolean> {
  if (!isNavigatorAvailable()) return false;
  if (!navigator.share) return false;

  try {
    await navigator.share({ title, text });
    return true;
  } catch (error) {
    // User cancelled the native share sheet. This is not an app error.
    if (error instanceof DOMException && error.name === "AbortError") {
      return false;
    }

    console.error("Failed to share text", error);
    return false;
  }
}

export async function copyText(text: string): Promise<boolean> {
  if (!isNavigatorAvailable()) return false;
  if (!navigator.clipboard?.writeText) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy text", error);
    return false;
  }
}
