const PIN_VARIANTS = [
  "scrap-pin-red",
  "scrap-pin-blue",
  "scrap-pin-green",
  "scrap-pin-yellow",
  "scrap-pin-purple",
  "scrap-pin-black"
];

export function getScrapPinVariant(index = 0) {
  return PIN_VARIANTS[index % PIN_VARIANTS.length];
}

const TAPE_VARIANTS = [
  "scrap-tape-cream",
  "scrap-tape-gray",
  "scrap-tape-pink",
  "scrap-tape-blue",
  "scrap-tape-green",
  "scrap-tape-yellow",
];

export function getScrapTapeVariant(index = 0) {
  return TAPE_VARIANTS[index % TAPE_VARIANTS.length];
}