import { ApifyClient } from 'apify-client';
import { ACTOR_ID, ACTOR_INPUT_DEFAULTS } from './config.js';

let _client = null;

export function getClient(token) {
  if (!_client) {
    _client = new ApifyClient({ token });
  }
  return _client;
}

/**
 * Executa uma query no ator Apify e retorna os itens brutos do dataset.
 * @param {ApifyClient} client
 * @param {string} query - A query de busca
 * @returns {Promise<object[]>} - Array de itens do dataset (uma página SERP por item)
 */
export async function runQuery(client, query) {
  const input = {
    ...ACTOR_INPUT_DEFAULTS,
    queries: query,
  };

  const run = await client.actor(ACTOR_ID).call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items;
}
