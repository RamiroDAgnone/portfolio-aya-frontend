export function validatePassword(password) {
  if (password.length < 8) return "Mínimo 8 caracteres";
  if (!/[A-Z]/.test(password)) return "Debe tener una mayúscula";
  if (!/[a-z]/.test(password)) return "Debe tener una minúscula";
  if (!/[0-9]/.test(password)) return "Debe tener un número";
  return null;
}