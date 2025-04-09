export default function getIdFromParam(id?: string | string[]): number | undefined {
  if (!id) return;

  return parseFloat(Array.isArray(id) ? id[0] : id);
}
