// Domínios que geram ruído (redes sociais, diretórios, portais de notícias, etc.)
const NOISE_DOMAINS = [
  'facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com',
  'youtube.com', 'tiktok.com', 'pinterest.com', 'whatsapp.com',
  'wikipedia.org', 'wikimedia.org',
  'google.com', 'google.com.br',
  'globo.com', 'g1.globo.com', 'r7.com', 'uol.com.br', 'terra.com.br',
  'folha.uol.com.br', 'estadao.com.br', 'nexojornal.com.br',
  'reclameaqui.com.br', 'procon.sp.gov.br',
  'mercadolivre.com.br', 'amazon.com.br', 'shopee.com.br', 'magalu.com.br',
  'americanas.com.br', 'submarino.com.br',
  'ifood.com.br', 'rappi.com.br', 'ubereats.com',
  'glassdoor.com', 'indeed.com', 'catho.com.br', 'vagas.com',
  'crunchbase.com', 'startups.com.br', 'abstartups.com.br',
];

/**
 * Extrai leads dos itens brutos retornados pelo Apify.
 * Cada item representa uma página SERP com array `organicResults`.
 * @param {object[]} rawItems
 * @param {string} sourceQuery
 * @returns {object[]} leads normalizados
 */
export function extractLeads(rawItems, sourceQuery) {
  const leads = [];

  for (const item of rawItems) {
    // O ator pode retornar os resultados em diferentes chaves
    const organicResults = item.organicResults ?? item.results ?? [];

    for (const result of organicResults) {
      const rawUrl = result.url ?? result.link ?? '';
      if (!rawUrl) continue;

      const website = normalizeUrl(rawUrl);
      if (!website) continue;
      if (isNoisyDomain(rawUrl)) continue;

      leads.push({
        companyName: cleanTitle(result.title ?? ''),
        website,
        description: trimDescription(result.description ?? result.snippet ?? ''),
        sourceQuery,
        foundAt: new Date().toISOString(),
      });
    }
  }

  return leads;
}

function isNoisyDomain(url) {
  return NOISE_DOMAINS.some(domain => url.includes(domain));
}

/**
 * Normaliza URL para apenas o hostname sem "www.", para uso como chave de dedup.
 */
function normalizeUrl(rawUrl) {
  try {
    const { hostname } = new URL(rawUrl);
    return hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Remove sufixos comuns de títulos do Google: " | LinkedIn", " - Home", etc.
 */
function cleanTitle(title) {
  return title
    .replace(/\s*[\|–—]\s*(LinkedIn|Crunchbase|GitHub|Wikipedia|Facebook|Instagram|Home|Início|Página Inicial).*$/i, '')
    .split(/\s*-\s+/)[0]
    .trim();
}

function trimDescription(desc) {
  return desc.trim().slice(0, 300);
}
