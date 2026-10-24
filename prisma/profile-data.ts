export const profileData = {
  slug: 'demid',
  name: 'Демид Кондратов',
  description: 'AI-инженер и fullstack-разработчик. Разрабатываю агентов, CRM-интеграции и автоматизацию на Python и TypeScript.',
  links: [
    { label: 'GitHub', url: 'https://github.com/kondratovdemid19-glitch', position: 0 },
  ],
  skills: ['Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'LLM API', 'Playwright']
    .map((name, position) => ({ name, position })),
  experience: [{
    company: 'MAXCAPITAL',
    position: 'AI Engineer / Full-Stack Developer',
    startDate: new Date('2023-02-01T00:00:00Z'),
    endDate: new Date('2026-03-01T00:00:00Z'),
    sortOrder: 0,
    achievements: [
      'Разработал CRM-агента с OpenAI tool calling и интеграцией Bitrix24 API.',
      'Разработал B2B-бота для квалификации заявок по шести направлениям и передачи данных в CRM.',
      'Автоматизировал обработку и публикацию контента для 10+ платформ.',
    ],
  }],
  projects: [{
    name: 'Browser Agent',
    description: 'Браузерный AI-агент: Claude API выбирает инструменты, Playwright выполняет действия.',
    url: 'https://github.com/kondratovdemid19-glitch/browser-agent',
    stack: ['TypeScript', 'Playwright', 'Claude API'],
    position: 0,
  }, {
    name: 'AI Native CRM Agent',
    description: 'Выполнение разрешённых CRM-действий по запросу на естественном языке с проверкой параметров.',
    url: null,
    stack: ['Python', 'OpenAI API', 'Bitrix24 API', 'Redis', 'aiogram'],
    position: 1,
  }, {
    name: 'SRVT Lead-Generation Bot',
    description: 'Квалификация B2B-лидов по шести направлениям, структурирование ответов и передача в CRM.',
    url: null,
    stack: ['Python', 'aiogram 3', 'PostgreSQL', 'pgvector', 'Docker'],
    position: 2,
  }, {
    name: 'Content Distributor',
    description: 'Транскрипция, AI-адаптация материалов и публикация по расписанию для 10+ платформ.',
    url: null,
    stack: ['Python', 'OpenAI API', 'FFmpeg', 'YouTube API', 'Telegram Bot API'],
    position: 3,
  }],
};
