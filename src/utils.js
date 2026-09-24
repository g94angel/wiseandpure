export function formatPhoneInputValue(value) {
  const digits = value.replaceAll(/\D/g, '').slice(0, 10);
  const match = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  if (!match) return '';

  const [, part1, part2, part3] = match;
  if (part2 === '') return part1;

  const formattedPart3 = part3 ? `-${part3}` : '';
  return `${part1}-${part2}${formattedPart3}`;
}
