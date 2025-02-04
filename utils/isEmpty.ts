export default function isEmpty<T>(array: T[]) {
  return Array.isArray(array) && array.length === 0;
}
