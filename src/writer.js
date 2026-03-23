import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const CSV_HEADERS = ['companyName', 'website', 'description', 'sourceQuery', 'foundAt'];

/**
 * Escreve leads em CSV e JSON no diretório de saída.
 * O timestamp no nome do arquivo garante que runs repetidos não sobrescrevam resultados anteriores.
 * @param {object[]} leads
 * @param {string} outputDir
 * @returns {{ csvPath: string, jsonPath: string }}
 */
export function writeOutputs(leads, outputDir) {
  mkdirSync(outputDir, { recursive: true });

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  const csvPath = join(outputDir, `leads_${ts}.csv`);
  const rows = [
    CSV_HEADERS.join(','),
    ...leads.map(lead =>
      CSV_HEADERS.map(h => csvCell(String(lead[h] ?? ''))).join(',')
    ),
  ];
  writeFileSync(csvPath, rows.join('\n'), 'utf-8');

  const jsonPath = join(outputDir, `leads_${ts}.json`);
  writeFileSync(jsonPath, JSON.stringify(leads, null, 2), 'utf-8');

  return { csvPath, jsonPath };
}

/**
 * Escapa um valor para CSV seguindo RFC 4180.
 * Envolve em aspas se contiver vírgula, nova linha ou aspas duplas.
 */
function csvCell(value) {
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
