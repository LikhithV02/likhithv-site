export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  problem: string;
  contribution: string[];
  architecture: string[];
  tags: string[];
  links: { label: string; href: string }[];
  visual: 'anvit' | 'deltavec' | 'docextract' | 'webnexus';
};

export const projects: Project[] = [
  {
    slug: 'anvit',
    name: 'Anvit',
    category: 'On-device document intelligence',
    summary: 'Ask questions across your documents and trace answers back to their sources, with inference on the device.',
    problem: 'Document assistants are most useful when answers can be checked against the source and sensitive files can stay on the device.',
    contribution: [
      'Built document parsing and hierarchical chunking that respects sections, tables, and lists.',
      'Integrated Gemma 4 through LiteRT-LM for on-device inference.',
      'Designed agentic retrieval with routing, decomposition, relevance checks, native tool calls, and source citations.'
    ],
    architecture: ['PDF / DOCX', 'Structured chunks', 'Local retrieval', 'Gemma 4 on device', 'Cited answer'],
    tags: ['Kotlin Multiplatform', 'Gemma 4', 'LiteRT-LM', 'Agentic RAG'],
    links: [
      { label: 'Visit Anvit', href: 'https://www.anvit.app/' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.likhith.anvit' }
    ],
    visual: 'anvit'
  },
  {
    slug: 'deltavec',
    name: 'DeltaVec',
    category: 'Incremental data infrastructure',
    summary: 'Keep a vector index aligned with changing PostgreSQL records without re-embedding everything.',
    problem: 'A vector index drifts when source rows change or disappear. Full rebuilds cost time and compute.',
    contribution: [
      'Used watermarks and SHA-256 content hashes to detect changed records.',
      'Made upserts idempotent with deterministic chunk IDs, and handled orphan chunks and soft deletes.',
      'Added Dagster orchestration, reconciliation sweeps, and data quality gates.'
    ],
    architecture: ['PostgreSQL source', 'Watermark + hash diff', 'Chunk updates', 'Qdrant index', 'Reconciliation'],
    tags: ['PostgreSQL', 'Qdrant', 'Dagster', 'FastAPI'],
    links: [
      { label: 'Try the demo', href: 'https://likhithv02.github.io/DeltaVec/' },
      { label: 'View code', href: 'https://github.com/LikhithV02/DeltaVec' }
    ],
    visual: 'deltavec'
  },
  {
    slug: 'docextract',
    name: 'DocExtract',
    category: 'Document workflow',
    summary: 'Extract and review fields from identity documents and invoices.',
    problem: 'Important fields in documents need a reliable path from extraction to human review.',
    contribution: ['Built a workflow to extract and review data from identity documents and invoices.'],
    architecture: ['Document input', 'Field extraction', 'Review'],
    tags: ['Document AI', 'Extraction'],
    links: [{ label: 'View code', href: 'https://github.com/LikhithV02/DocExtract' }],
    visual: 'docextract'
  },
  {
    slug: 'webnexus',
    name: 'WebNexus',
    category: 'Retrieval system',
    summary: 'A web crawler and document search system built around retrieval.',
    problem: 'Finding relevant passages across crawled material calls for a searchable, structured collection.',
    contribution: ['Built a web crawling and document search workflow centered on retrieval.'],
    architecture: ['Crawl', 'Index', 'Search'],
    tags: ['Crawler', 'Search'],
    links: [{ label: 'View code', href: 'https://github.com/LikhithV02/WebNexus' }],
    visual: 'webnexus'
  }
];

export const experience = [
  {
    company: 'Networth Corp',
    role: 'AI Engineer',
    period: 'Oct 2024 — Present',
    logo: '/brands/networth-wordmark.png',
    url: 'https://www.networth-corp.com/',
    summary: 'Production document AI for insurance workflows.',
    work: [
      'Customized chunking for a RAG chatbot over unstructured insurance documents; the résumé reports 20% higher response accuracy and 2% lower operational cost.',
      'LLM evaluation and query enrichment modules for retrieval quality and answer reliability.',
      'Currently developing synthetic data generation across structured, semi-structured, and unstructured sources while preserving dataset correlations.'
    ]
  },
  {
    company: 'PG-AGI',
    role: 'AI/ML Intern',
    period: 'Dec 2023 — Jun 2024',
    logo: '/brands/pgagi-logo.png',
    url: 'https://pgagi.in/',
    summary: 'From early concepts to production GenAI applications.',
    work: [
      'Led six proofs of concept and two production GenAI projects, including HireXtra’s AI Recruiter, according to the résumé.',
      'Built AI agents and RAG pipelines with Python, FastAPI, MongoDB, LangChain, and LlamaIndex.'
    ]
  }
];

export const hermesRoles = [
  {
    id: 'pr',
    name: 'Research digest',
    entry: 'Discord #pr',
    mission: 'Find relevant public conversations and prepare a digest.',
    path: ['Discord request', 'Dedicated PR gateway', 'Public-source collection', 'Deduplicate + rank', 'Digest for review'],
    note: 'A separate bot and gateway keep this workflow apart from the others.'
  },
  {
    id: 'jobs',
    name: 'Job search',
    entry: 'Discord #jobs',
    mission: 'Support a focused job-search workflow.',
    path: ['Discord request', 'Jobs gateway', 'Search tools', 'Candidate roles', 'Human review'],
    note: 'The jobs agent has its own gateway and credentials.'
  },
  {
    id: 'trade',
    name: 'Trading research',
    entry: 'Discord #trade',
    mission: 'Run research and paper-trading experiments.',
    path: ['Discord request', 'Trade gateway', 'Research tools', 'Paper executor', 'Review gate'],
    note: 'This profile runs under a separate user without sudo or Docker membership.'
  },
  {
    id: 'content',
    name: 'Content studio',
    entry: 'Discord #content',
    mission: 'Turn researched ideas into approved videos and carousels.',
    path: ['Pitch', 'Approval', 'Mac production', 'Fact checks + render checks', 'Private upload'],
    note: 'Publication remains a human decision.'
  },
  {
    id: 'media',
    name: 'Media workflow',
    entry: 'Discord #media',
    mission: 'Handle media requests through a constrained tool set.',
    path: ['Discord request', 'Media gateway', 'Sandboxed agent', 'Limited media tools', 'Library'],
    note: 'The friend-facing agent is limited to a small media tool set.'
  }
];

export const studioStages = [
  { id: 'research', name: 'Research', description: 'A VPS agent gathers ideas and source material. Claims must trace back to primary evidence.', artifact: 'Pitch + sources' },
  { id: 'approve', name: 'Approval', description: 'A selected pitch is approved before production starts. Unapproved ideas stay as pitches.', artifact: 'Approved handoff' },
  { id: 'script', name: 'Script', description: 'I turn the idea into a script and timed beats, then check factual claims.', artifact: 'Script + beats' },
  { id: 'voice', name: 'Narration', description: 'Gemini generates narration from the final script. Timing follows the recorded words.', artifact: 'Voice + timestamps' },
  { id: 'animate', name: 'Animation', description: 'HTML, SVG, and Canvas scenes explain the idea. Captions follow the spoken words.', artifact: 'Scenes + captions' },
  { id: 'verify', name: 'Verification', description: 'The render is checked for audio, blank frames, caption safety, and visual claim accuracy.', artifact: 'Render audit' },
  { id: 'deliver', name: 'Private upload', description: 'The finished video is uploaded privately. I decide when it becomes public.', artifact: 'Private video' }
];
