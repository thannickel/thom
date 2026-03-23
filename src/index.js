import { APIFY_TOKEN, OUTPUT_DIR, QUERIES } from './config.js';
import { getClient, runQuery } from './apify.js';
import { extractLeads } from './extractor.js';
import { deduplicate } from './deduplicator.js';
import { writeOutputs } from './writer.js';

const FORMAT = process.argv.includes('--format')
  ? process.argv[process.argv.indexOf('--format') + 1]
  : 'csv';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== Gerador de Leads — Marcas e Patentes em São Paulo ===\n');
  console.log(`Queries: ${QUERIES.length} | Saída: ${OUTPUT_DIR} | Formato: ${FORMAT}\n`);

  const client = getClient(APIFY_TOKEN);
  const allLeads = [];

  for (let i = 0; i < QUERIES.length; i++) {
    const query = QUERIES[i];
    console.log(`[${i + 1}/${QUERIES.length}] "${query}"`);

    try {
      const rawItems = await runQuery(client, query);

      // Na primeira query, inspecionar a estrutura do resultado para facilitar debug
      if (i === 0 && rawItems.length > 0) {
        const keys = Object.keys(rawItems[0]);
        console.log(`  [debug] Campos do item Apify: ${keys.join(', ')}`);
      }

      const leads = extractLeads(rawItems, query);
      console.log(`  -> ${leads.length} leads extraídos (${rawItems.length} itens brutos)`);
      allLeads.push(...leads);
    } catch (err) {
      console.error(`  ERRO: ${err.message}`);
      // Continua para a próxima query em vez de abortar tudo
    }

    // Pequena pausa entre queries para respeitar rate limits do Apify
    if (i < QUERIES.length - 1) {
      await sleep(2000);
    }
  }

  console.log(`\nLeads brutos (com duplicatas): ${allLeads.length}`);

  const uniqueLeads = deduplicate(allLeads);
  console.log(`Leads únicos após deduplicação: ${uniqueLeads.length}`);

  if (uniqueLeads.length === 0) {
    console.log('\nNenhum lead encontrado. Verifique seu token Apify e tente novamente.');
    process.exit(0);
  }

  const { csvPath, jsonPath } = writeOutputs(uniqueLeads, OUTPUT_DIR);

  console.log('\nArquivos gerados:');
  if (FORMAT === 'json') {
    console.log(`  JSON -> ${jsonPath}`);
  } else {
    console.log(`  CSV  -> ${csvPath}`);
    console.log(`  JSON -> ${jsonPath}`);
  }
  console.log(`\nTotal de leads únicos: ${uniqueLeads.length}`);
}

main().catch(err => {
  console.error('\nErro fatal:', err.message);
  process.exit(1);
});
