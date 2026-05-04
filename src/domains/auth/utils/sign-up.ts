export function getUsernameCheckLabel(username: string, isChecking: boolean, isAvailable: boolean | null) {
  if (!username.trim()) return "Choose a username";
  if (isChecking) return "Checking availability…";
  if (isAvailable === true) return "Username is available";
  if (isAvailable === false) return "Username is already taken";
  return "Choose a username";
}
