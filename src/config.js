import 'dotenv/config';

const token = process.env.APIFY_TOKEN;

if (!token) {
  console.error('ERRO: variável de ambiente APIFY_TOKEN não definida.');
  console.error('Copie .env.example para .env e insira seu token Apify.');
  process.exit(1);
}

export const APIFY_TOKEN = token;
export const OUTPUT_DIR = process.env.OUTPUT_DIR ?? './output';
export const ACTOR_ID = 'nFJndFXA5zjCTuudP';

// Queries direcionadas a empresas em São Paulo com necessidade de registro de marcas e patentes
export const QUERIES = [
  // Startups e tecnologia
  'startups de tecnologia São Paulo 2024 lançamento produto',
  'empresas SaaS B2B São Paulo plataforma software',
  'fintechs brasileiras São Paulo produto financeiro novo',
  'healthtechs startups São Paulo aplicativo saúde inovação',
  'agritechs São Paulo startup inovação tecnologia',
  'edtechs São Paulo plataforma educação startup',

  // E-commerce e marcas próprias
  'marca própria e-commerce São Paulo loja online',
  'moda marca própria São Paulo loja online',
  'cosméticos marca própria São Paulo CNPJ lançamento',
  'suplementos alimentares marca própria São Paulo',
  'linha de produtos São Paulo loja Shopify',

  // Alimentos e bebidas
  'indústria alimentícia São Paulo nova marca lançamento',
  'franquia alimentação São Paulo nova marca delivery',
  'cerveja artesanal marca própria São Paulo distribuição',
  'cafeteria marca própria São Paulo expansão',

  // Manufatura e produtos inovadores
  'fabricante São Paulo produto inovador registro patente',
  'indústria São Paulo desenvolvimento produto novo CNPJ',
  'produto tecnológico inovação São Paulo empresa startup',

  // Pet, beleza e lifestyle
  'pet shop marca própria São Paulo loja online',
  'marcas de beleza São Paulo lançamento e-commerce',
  'produtos sustentáveis marca São Paulo startup',

  // Hubs de inovação (multipliers: retornam muitas empresas por query)
  'empresas portfólio Cubo Itaú São Paulo site:cubo.network',
  'startups portfólio inovabra São Paulo',
  'startups aceleradas Endeavor Brasil São Paulo lista',
  'empresas incubadas USP São Paulo inovação CNPJ',
];

export const ACTOR_INPUT_DEFAULTS = {
  resultsPerPage: 100,
  maxPagesPerQuery: 1,
  disableGoogleSearchResults: false,
  aiModeSearch: { enableAiMode: false },
  perplexitySearch: {
    enablePerplexity: false,
    returnImages: false,
    returnRelatedQuestions: false,
  },
  chatGptSearch: { enableChatGpt: false },
  maximumLeadsEnrichmentRecords: 0,
  focusOnPaidAds: false,
  searchLanguage: '',
  languageCode: '',
  forceExactMatch: false,
  wordsInTitle: [],
  wordsInText: [],
  wordsInUrl: [],
  mobileResults: false,
  includeUnfilteredResults: false,
  saveHtml: false,
  saveHtmlToKeyValueStore: false,
  includeIcons: false,
};
