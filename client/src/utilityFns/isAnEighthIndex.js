export default function isAnEighthIndex(_, i) {
  return i === 0 ? true : i % 16 === 15;
}
