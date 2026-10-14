const number = new Intl.NumberFormat("en-US");

export function formatElevation(m: number) {
  return `${number.format(m)} m`;
}

export function formatArea(km2: number) {
  return `${number.format(km2)} km²`;
}

