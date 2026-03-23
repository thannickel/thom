/**
 * Remove leads duplicados com base no hostname normalizado (campo `website`).
 * A primeira ocorrência vence, preservando o contexto da query original.
 * @param {object[]} leads
 * @returns {object[]}
 */
export function deduplicate(leads) {
  const seen = new Set();
  return leads.filter(lead => {
    const key = lead.website.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
