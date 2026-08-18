export function waLink(number: string, name?: string) {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`;
  const msg = `Hi${name ? ` ${name}` : ''}! I found your profile on Bantu Connect and would like to inquire about booking...`;
  return `${base}?text=${encodeURIComponent(msg)}`;
}
