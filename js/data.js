// ===========================
// MOCK DATA
// ===========================

// Users Database
const users = [
    {
        id: 'user-1',
        name: 'João Silva',
        email: 'joao.silva@goodsystem.com',
        role: 'Product Owner',
        avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
        id: 'user-2',
        name: 'Maria Santos',
        email: 'maria.santos@goodsystem.com',
        role: 'Tech Lead',
        avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
        id: 'user-3',
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@goodsystem.com',
        role: 'Developer',
        avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
        id: 'user-4',
        name: 'Ana Costa',
        email: 'ana.costa@goodsystem.com',
        role: 'QA Engineer',
        avatar: 'https://i.pravatar.cc/150?img=9'
    },
    {
        id: 'user-5',
        name: 'Carlos Mendes',
        email: 'carlos.mendes@goodsystem.com',
        role: 'UX Designer',
        avatar: 'https://i.pravatar.cc/150?img=7'
    }
];

// Sprints Database
const sprints = [
    {
        id: 'sprint-12',
        name: 'Sprint 12',
        startDate: '2026-01-06',
        endDate: '2026-01-19',
        status: 'active'
    },
    {
        id: 'sprint-13',
        name: 'Sprint 13',
        startDate: '2026-01-20',
        endDate: '2026-02-02',
        status: 'planned'
    },
    {
        id: 'sprint-14',
        name: 'Sprint 14',
        startDate: '2026-02-03',
        endDate: '2026-02-16',
        status: 'planned'
    }
];

// Requirements Database
let requirements = [
    {
        id: 'REQ-001',
        title: 'Sistema de Autenticação com OAuth 2.0',
        description: 'Implementar sistema de autenticação utilizando OAuth 2.0 para permitir login via Google, GitHub e Microsoft. Deve incluir refresh tokens e gerenciamento de sessões seguras.',
        type: 'functional',
        status: 'approved',
        priority: 'high',
        sprint: 'sprint-12',
        assignee: 'user-2',
        tags: ['authentication', 'security', 'backend'],
        createdAt: '2026-01-02T10:30:00Z',
        updatedAt: '2026-01-05T14:20:00Z',
        createdBy: 'user-1',
        version: '1.2',
        commentsCount: 5,
        attachmentsCount: 2
    },
    {
        id: 'REQ-002',
        title: 'Dashboard Analítico com Gráficos Interativos',
        description: 'Criar dashboard com visualizações de dados em tempo real utilizando Chart.js ou D3.js. Incluir filtros por período, tipo de requisito e sprint.',
        type: 'functional',
        status: 'pending',
        priority: 'high',
        sprint: 'sprint-12',
        assignee: 'user-3',
        tags: ['frontend', 'dashboard', 'charts'],
        createdAt: '2026-01-03T09:15:00Z',
        updatedAt: '2026-01-06T11:45:00Z',
        createdBy: 'user-1',
        version: '1.0',
        commentsCount: 3,
        attachmentsCount: 1
    },
    {
        id: 'REQ-003',
        title: 'API RESTful para Gestão de Requisitos',
        description: 'Desenvolver API RESTful completa com endpoints para CRUD de requisitos, incluindo paginação, ordenação, filtros e busca textual. Documentação via Swagger.',
        type: 'technical',
        status: 'approved',
        priority: 'high',
        sprint: 'sprint-12',
        assignee: 'user-2',
        tags: ['backend', 'api', 'rest'],
        createdAt: '2026-01-02T14:20:00Z',
        updatedAt: '2026-01-04T16:30:00Z',
        createdBy: 'user-1',
        version: '1.1',
        commentsCount: 3,
        attachmentsCount: 3
    },
    {
        id: 'REQ-004',
        title: 'Sistema de Notificações em Tempo Real',
        description: 'Implementar sistema de notificações usando WebSockets para alertar usuários sobre mudanças em requisitos, aprovações pendentes e comentários.',
        type: 'functional',
        status: 'draft',
        priority: 'medium',
        sprint: 'sprint-13',
        assignee: null,
        tags: ['realtime', 'notifications', 'websocket'],
        createdAt: '2026-01-05T08:00:00Z',
        updatedAt: '2026-01-05T08:00:00Z',
        createdBy: 'user-1',
        version: '1.0',
        commentsCount: 0,
        attachmentsCount: 0
    },
    {
        id: 'REQ-005',
        title: 'Exportação de Relatórios em PDF e Excel',
        description: 'Funcionalidade para exportar requisitos e relatórios em formatos PDF e Excel, com opções de personalização de layout e campos.',
        type: 'functional',
        status: 'pending',
        priority: 'medium',
        sprint: 'sprint-13',
        assignee: 'user-3',
        tags: ['export', 'reports', 'pdf'],
        createdAt: '2026-01-04T13:30:00Z',
        updatedAt: '2026-01-06T09:20:00Z',
        createdBy: 'user-1',
        version: '1.0',
        commentsCount: 2,
        attachmentsCount: 1
    },
    {
        id: 'REQ-006',
        title: 'Interface Responsiva Mobile-First',
        description: 'Desenvolver interface completamente responsiva seguindo abordagem mobile-first, garantindo usabilidade em dispositivos de todos os tamanhos.',
        type: 'non-functional',
        status: 'approved',
        priority: 'high',
        sprint: 'sprint-12',
        assignee: 'user-5',
        tags: ['frontend', 'responsive', 'ux'],
        createdAt: '2026-01-03T11:00:00Z',
        updatedAt: '2026-01-05T15:45:00Z',
        createdBy: 'user-5',
        version: '1.0',
        commentsCount: 4,
        attachmentsCount: 5
    },
    {
        id: 'REQ-007',
        title: 'Sistema de Versionamento de Requisitos',
        description: 'Implementar controle de versões para requisitos, permitindo visualizar histórico completo de alterações e reverter para versões anteriores.',
        type: 'functional',
        status: 'rejected',
        priority: 'low',
        sprint: null,
        assignee: null,
        tags: ['versioning', 'history', 'backend'],
        createdAt: '2026-01-02T16:45:00Z',
        updatedAt: '2026-01-04T10:15:00Z',
        createdBy: 'user-2',
        version: '1.0',
        commentsCount: 2,
        attachmentsCount: 0
    },
    {
        id: 'REQ-008',
        title: 'Integração com Jira e GitHub',
        description: 'Criar integração bidirecional com Jira e GitHub para sincronizar requisitos, issues e pull requests automaticamente.',
        type: 'technical',
        status: 'draft',
        priority: 'medium',
        sprint: 'sprint-13',
        assignee: null,
        tags: ['integration', 'jira', 'github'],
        createdAt: '2026-01-06T07:30:00Z',
        updatedAt: '2026-01-06T07:30:00Z',
        createdBy: 'user-1',
        version: '1.0',
        commentsCount: 0,
        attachmentsCount: 0
    },
    {
        id: 'REQ-009',
        title: 'Sistema de Comentários e Menções',
        description: 'Implementar sistema de comentários com suporte a menções (@usuario), formatação markdown e anexos de arquivos.',
        type: 'functional',
        status: 'pending',
        priority: 'medium',
        sprint: 'sprint-12',
        assignee: 'user-3',
        tags: ['comments', 'collaboration', 'frontend'],
        createdAt: '2026-01-04T10:20:00Z',
        updatedAt: '2026-01-06T14:10:00Z',
        createdBy: 'user-1',
        version: '1.0',
        commentsCount: 3,
        attachmentsCount: 0
    },
    {
        id: 'REQ-010',
        title: 'Performance e Otimização de Queries',
        description: 'Otimizar queries do banco de dados, implementar índices apropriados e caching com Redis para melhorar performance da aplicação.',
        type: 'non-functional',
        status: 'approved',
        priority: 'high',
        sprint: 'sprint-12',
        assignee: 'user-2',
        tags: ['performance', 'database', 'optimization'],
        createdAt: '2026-01-03T15:00:00Z',
        updatedAt: '2026-01-05T17:30:00Z',
        createdBy: 'user-2',
        version: '1.0',
        commentsCount: 2,
        attachmentsCount: 1
    },
    {
        id: 'REQ-011',
        title: 'Testes Automatizados E2E com Playwright',
        description: 'Implementar suite completa de testes end-to-end utilizando Playwright, cobrindo todos os fluxos críticos do sistema.',
        type: 'technical',
        status: 'pending',
        priority: 'medium',
        sprint: 'sprint-13',
        assignee: 'user-4',
        tags: ['testing', 'e2e', 'quality'],
        createdAt: '2026-01-05T09:00:00Z',
        updatedAt: '2026-01-06T10:30:00Z',
        createdBy: 'user-4',
        version: '1.0',
        commentsCount: 2,
        attachmentsCount: 0
    },
    {
        id: 'REQ-012',
        title: 'Tema Claro/Escuro Personalizável',
        description: 'Implementar suporte a temas claro e escuro, com preferência salva por usuário e detecção automática de preferência do sistema.',
        type: 'functional',
        status: 'draft',
        priority: 'low',
        sprint: 'sprint-14',
        assignee: null,
        tags: ['frontend', 'theme', 'ux'],
        createdAt: '2026-01-06T12:00:00Z',
        updatedAt: '2026-01-06T12:00:00Z',
        createdBy: 'user-5',
        version: '1.0',
        commentsCount: 1,
        attachmentsCount: 2
    },
    {
        id: 'REQ-013',
        title: 'Auditoria e Logs de Sistema',
        description: 'Sistema completo de auditoria registrando todas as ações dos usuários, com logs estruturados e pesquisáveis.',
        type: 'non-functional',
        status: 'approved',
        priority: 'high',
        sprint: 'sprint-12',
        assignee: 'user-2',
        tags: ['security', 'audit', 'logging'],
        createdAt: '2026-01-02T11:30:00Z',
        updatedAt: '2026-01-05T13:00:00Z',
        createdBy: 'user-1',
        version: '1.1',
        commentsCount: 2,
        attachmentsCount: 1
    },
    {
        id: 'REQ-014',
        title: 'Sistema de Busca Avançada',
        description: 'Implementar busca avançada com suporte a filtros múltiplos, operadores booleanos e busca full-text com ElasticSearch.',
        type: 'functional',
        status: 'pending',
        priority: 'medium',
        sprint: 'sprint-13',
        assignee: 'user-3',
        tags: ['search', 'elasticsearch', 'backend'],
        createdAt: '2026-01-05T14:15:00Z',
        updatedAt: '2026-01-06T16:20:00Z',
        createdBy: 'user-1',
        version: '1.0',
        commentsCount: 2,
        attachmentsCount: 0
    },
    {
        id: 'REQ-015',
        title: 'Documentação Interativa da API',
        description: 'Criar documentação interativa da API usando Swagger/OpenAPI com exemplos de requisições e respostas.',
        type: 'technical',
        status: 'approved',
        priority: 'medium',
        sprint: 'sprint-12',
        assignee: 'user-2',
        tags: ['documentation', 'api', 'swagger'],
        createdAt: '2026-01-03T16:30:00Z',
        updatedAt: '2026-01-05T11:15:00Z',
        createdBy: 'user-1',
        version: '1.0',
        commentsCount: 2,
        attachmentsCount: 1
    }
];

// Comments Database
const comments = {
    'REQ-001': [
        {
            id: 'comment-1',
            author: 'user-2',
            content: 'Precisamos garantir que o refresh token seja armazenado de forma segura. Sugiro usar HttpOnly cookies.',
            createdAt: '2026-01-03T11:20:00Z'
        },
        {
            id: 'comment-2',
            author: 'user-1',
            content: 'Boa sugestão! Vou atualizar a especificação para incluir isso.',
            createdAt: '2026-01-03T14:30:00Z'
        },
        {
            id: 'comment-3',
            author: 'user-4',
            content: 'Como vamos lidar com rate limiting nas tentativas de login?',
            createdAt: '2026-01-04T09:15:00Z'
        },
        {
            id: 'comment-4',
            author: 'user-2',
            content: 'Implementaremos rate limiting baseado em IP, máximo 5 tentativas em 15 minutos.',
            createdAt: '2026-01-04T10:45:00Z'
        },
        {
            id: 'comment-5',
            author: 'user-1',
            content: 'Aprovado! Pode iniciar a implementação.',
            createdAt: '2026-01-05T14:20:00Z'
        }
    ],
    'REQ-002': [
        {
            id: 'comment-6',
            author: 'user-5',
            content: 'Sugiro usar Chart.js pela facilidade de implementação e boa documentação.',
            createdAt: '2026-01-04T10:00:00Z'
        },
        {
            id: 'comment-7',
            author: 'user-3',
            content: 'Concordo. Chart.js tem boa performance e é mais leve que D3.js.',
            createdAt: '2026-01-04T11:30:00Z'
        },
        {
            id: 'comment-8',
            author: 'user-1',
            content: 'Perfeito! Vamos com Chart.js então.',
            createdAt: '2026-01-06T11:45:00Z'
        }
    ],
    'REQ-003': [
        {
            id: 'comment-9',
            author: 'user-2',
            content: 'Swagger ficará em /docs e precisa de auth básica.',
            createdAt: '2026-01-03T10:10:00Z'
        },
        {
            id: 'comment-10',
            author: 'user-3',
            content: 'Incluí paginação padrão page=1&pageSize=20.',
            createdAt: '2026-01-03T15:45:00Z'
        },
        {
            id: 'comment-11',
            author: 'user-1',
            content: 'Lembrar de ordenar por updatedAt desc como default.',
            createdAt: '2026-01-04T09:30:00Z'
        }
    ],
    'REQ-005': [
        {
            id: 'comment-12',
            author: 'user-4',
            content: 'Precisamos definir template do PDF antes do sprint.',
            createdAt: '2026-01-05T08:20:00Z'
        },
        {
            id: 'comment-13',
            author: 'user-3',
            content: 'Uso de jsPDF + sheetjs deve cobrir ambos formatos.',
            createdAt: '2026-01-06T10:05:00Z'
        }
    ],
    'REQ-006': [
        {
            id: 'comment-14',
            author: 'user-5',
            content: 'Grid mobile-first com breakpoints em 480/768/1024.',
            createdAt: '2026-01-03T12:40:00Z'
        },
        {
            id: 'comment-15',
            author: 'user-4',
            content: 'Adicionar testes visuais no Playwright para mobile.',
            createdAt: '2026-01-04T11:10:00Z'
        },
        {
            id: 'comment-16',
            author: 'user-5',
            content: 'Hamburger menu precisa de animação acessível.',
            createdAt: '2026-01-05T09:00:00Z'
        },
        {
            id: 'comment-17',
            author: 'user-1',
            content: 'UX ok, aprovo seguir com protótipos Figma.',
            createdAt: '2026-01-05T16:10:00Z'
        }
    ],
    'REQ-007': [
        {
            id: 'comment-18',
            author: 'user-2',
            content: 'Versionamento deve registrar diff de campos.',
            createdAt: '2026-01-02T18:00:00Z'
        },
        {
            id: 'comment-19',
            author: 'user-3',
            content: 'Podemos usar hashing do payload para detectar mudanças.',
            createdAt: '2026-01-03T09:10:00Z'
        }
    ],
    'REQ-009': [
        {
            id: 'comment-20',
            author: 'user-3',
            content: 'Menções usam @id do usuário, não nome.',
            createdAt: '2026-01-04T12:40:00Z'
        },
        {
            id: 'comment-21',
            author: 'user-5',
            content: 'Adicionar preview Markdown no lado direito.',
            createdAt: '2026-01-05T08:50:00Z'
        },
        {
            id: 'comment-22',
            author: 'user-4',
            content: 'Limitar anexos a 10MB por comentário.',
            createdAt: '2026-01-06T09:25:00Z'
        }
    ],
    'REQ-010': [
        {
            id: 'comment-23',
            author: 'user-2',
            content: 'Criar índice composto em createdAt + status.',
            createdAt: '2026-01-04T18:20:00Z'
        },
        {
            id: 'comment-24',
            author: 'user-1',
            content: 'Cache Redis com TTL de 5 minutos para listas.',
            createdAt: '2026-01-05T08:05:00Z'
        }
    ],
    'REQ-011': [
        {
            id: 'comment-25',
            author: 'user-4',
            content: 'Vamos focar em smoke paths primeiro.',
            createdAt: '2026-01-05T10:10:00Z'
        },
        {
            id: 'comment-26',
            author: 'user-3',
            content: 'Rodar suite nightly no pipeline.',
            createdAt: '2026-01-06T07:45:00Z'
        }
    ],
    'REQ-012': [
        {
            id: 'comment-27',
            author: 'user-5',
            content: 'Tema escuro segue WCAG AA para contraste.',
            createdAt: '2026-01-06T12:30:00Z'
        }
    ],
    'REQ-013': [
        {
            id: 'comment-28',
            author: 'user-2',
            content: 'Logs estruturados em JSON com requestId.',
            createdAt: '2026-01-03T12:00:00Z'
        },
        {
            id: 'comment-29',
            author: 'user-1',
            content: 'Rever retenção de 90 dias por compliance.',
            createdAt: '2026-01-04T08:50:00Z'
        }
    ],
    'REQ-014': [
        {
            id: 'comment-30',
            author: 'user-3',
            content: 'Operadores booleanos AND/OR/NOT suportados.',
            createdAt: '2026-01-05T14:40:00Z'
        },
        {
            id: 'comment-31',
            author: 'user-2',
            content: 'ElasticSearch 8.x com analisador pt-br.',
            createdAt: '2026-01-06T08:15:00Z'
        }
    ],
    'REQ-015': [
        {
            id: 'comment-32',
            author: 'user-1',
            content: 'Publicar contrato OpenAPI no portal interno.',
            createdAt: '2026-01-03T17:00:00Z'
        },
        {
            id: 'comment-33',
            author: 'user-2',
            content: 'Exemplos devem cobrir erros 4xx/5xx.',
            createdAt: '2026-01-04T09:40:00Z'
        }
    ]
};

// History/Audit Log
const auditLog = {
    'REQ-001': [
        {
            id: 'audit-1',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-02T10:30:00Z'
        },
        {
            id: 'audit-2',
            action: 'updated',
            user: 'user-1',
            details: 'Descrição atualizada para incluir detalhes sobre refresh tokens',
            timestamp: '2026-01-03T15:00:00Z'
        },
        {
            id: 'audit-3',
            action: 'assigned',
            user: 'user-1',
            details: 'Atribuído para Maria Santos',
            timestamp: '2026-01-04T09:00:00Z'
        },
        {
            id: 'audit-4',
            action: 'status_change',
            user: 'user-1',
            details: 'Status alterado de "Pendente" para "Aprovado"',
            timestamp: '2026-01-05T14:20:00Z'
        },
        {
            id: 'audit-5',
            action: 'version',
            user: 'user-1',
            details: 'Versão atualizada para 1.2',
            timestamp: '2026-01-05T14:20:00Z'
        }
    ],
    'REQ-002': [
        {
            id: 'audit-6',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-03T09:15:00Z'
        }
    ],
    'REQ-003': [
        {
            id: 'audit-7',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-02T14:20:00Z'
        }
    ],
    'REQ-004': [
        {
            id: 'audit-8',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-05T08:00:00Z'
        }
    ],
    'REQ-005': [
        {
            id: 'audit-9',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-04T13:30:00Z'
        }
    ],
    'REQ-006': [
        {
            id: 'audit-10',
            action: 'created',
            user: 'user-5',
            details: 'Requisito criado',
            timestamp: '2026-01-03T11:00:00Z'
        }
    ],
    'REQ-007': [
        {
            id: 'audit-11',
            action: 'created',
            user: 'user-2',
            details: 'Requisito criado',
            timestamp: '2026-01-02T16:45:00Z'
        }
    ],
    'REQ-008': [
        {
            id: 'audit-12',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-06T07:30:00Z'
        }
    ],
    'REQ-009': [
        {
            id: 'audit-13',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-04T10:20:00Z'
        }
    ],
    'REQ-010': [
        {
            id: 'audit-14',
            action: 'created',
            user: 'user-2',
            details: 'Requisito criado',
            timestamp: '2026-01-03T15:00:00Z'
        }
    ],
    'REQ-011': [
        {
            id: 'audit-15',
            action: 'created',
            user: 'user-4',
            details: 'Requisito criado',
            timestamp: '2026-01-05T09:00:00Z'
        }
    ],
    'REQ-012': [
        {
            id: 'audit-16',
            action: 'created',
            user: 'user-5',
            details: 'Requisito criado',
            timestamp: '2026-01-06T12:00:00Z'
        }
    ],
    'REQ-013': [
        {
            id: 'audit-17',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-02T11:30:00Z'
        }
    ],
    'REQ-014': [
        {
            id: 'audit-18',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-05T14:15:00Z'
        }
    ],
    'REQ-015': [
        {
            id: 'audit-19',
            action: 'created',
            user: 'user-1',
            details: 'Requisito criado',
            timestamp: '2026-01-03T16:30:00Z'
        }
    ]
};

// Attachments Database
const attachments = {
    'REQ-001': [
        {
            id: 'att-1',
            name: 'oauth-flow-diagram.png',
            type: 'image/png',
            size: '245 KB',
            uploadedBy: 'user-1',
            uploadedAt: '2026-01-02T11:00:00Z'
        },
        {
            id: 'att-2',
            name: 'security-requirements.pdf',
            type: 'application/pdf',
            size: '1.2 MB',
            uploadedBy: 'user-2',
            uploadedAt: '2026-01-03T16:20:00Z'
        }
    ],
    'REQ-002': [
        {
            id: 'att-8',
            name: 'dashboard-wireframe.pdf',
            type: 'application/pdf',
            size: '640 KB',
            uploadedBy: 'user-5',
            uploadedAt: '2026-01-05T10:30:00Z'
        }
    ],
    'REQ-003': [
        {
            id: 'att-9',
            name: 'api-contract-v1.yaml',
            type: 'application/json',
            size: '12 KB',
            uploadedBy: 'user-2',
            uploadedAt: '2026-01-03T16:10:00Z'
        },
        {
            id: 'att-10',
            name: 'pagination-strategy.pdf',
            type: 'application/pdf',
            size: '520 KB',
            uploadedBy: 'user-3',
            uploadedAt: '2026-01-04T09:50:00Z'
        },
        {
            id: 'att-11',
            name: 'error-codes.xlsx',
            type: 'application/json',
            size: '34 KB',
            uploadedBy: 'user-1',
            uploadedAt: '2026-01-04T11:05:00Z'
        }
    ],
    'REQ-006': [
        {
            id: 'att-3',
            name: 'mobile-mockup-login.png',
            type: 'image/png',
            size: '180 KB',
            uploadedBy: 'user-5',
            uploadedAt: '2026-01-03T12:00:00Z'
        },
        {
            id: 'att-4',
            name: 'mobile-mockup-dashboard.png',
            type: 'image/png',
            size: '220 KB',
            uploadedBy: 'user-5',
            uploadedAt: '2026-01-03T12:05:00Z'
        },
        {
            id: 'att-5',
            name: 'tablet-mockups.png',
            type: 'image/png',
            size: '310 KB',
            uploadedBy: 'user-5',
            uploadedAt: '2026-01-03T12:10:00Z'
        },
        {
            id: 'att-6',
            name: 'responsive-guidelines.pdf',
            type: 'application/pdf',
            size: '890 KB',
            uploadedBy: 'user-5',
            uploadedAt: '2026-01-03T14:30:00Z'
        },
        {
            id: 'att-7',
            name: 'breakpoints-config.json',
            type: 'application/json',
            size: '2 KB',
            uploadedBy: 'user-5',
            uploadedAt: '2026-01-04T09:00:00Z'
        }
    ],
    'REQ-005': [
        {
            id: 'att-12',
            name: 'export-mapping.xlsx',
            type: 'application/json',
            size: '45 KB',
            uploadedBy: 'user-3',
            uploadedAt: '2026-01-06T10:10:00Z'
        }
    ],
    'REQ-010': [
        {
            id: 'att-13',
            name: 'query-plan-analysis.pdf',
            type: 'application/pdf',
            size: '780 KB',
            uploadedBy: 'user-2',
            uploadedAt: '2026-01-05T18:10:00Z'
        }
    ],
    'REQ-012': [
        {
            id: 'att-14',
            name: 'theme-tokens.json',
            type: 'application/json',
            size: '6 KB',
            uploadedBy: 'user-5',
            uploadedAt: '2026-01-06T12:10:00Z'
        },
        {
            id: 'att-15',
            name: 'contrast-checks.pdf',
            type: 'application/pdf',
            size: '210 KB',
            uploadedBy: 'user-4',
            uploadedAt: '2026-01-06T12:40:00Z'
        }
    ],
    'REQ-013': [
        {
            id: 'att-16',
            name: 'logging-schema.json',
            type: 'application/json',
            size: '9 KB',
            uploadedBy: 'user-2',
            uploadedAt: '2026-01-03T12:20:00Z'
        }
    ],
    'REQ-015': [
        {
            id: 'att-17',
            name: 'swagger-sample.pdf',
            type: 'application/pdf',
            size: '320 KB',
            uploadedBy: 'user-1',
            uploadedAt: '2026-01-04T10:00:00Z'
        }
    ]
};

// Helper function to get user by ID
function getUserById(userId) {
    return users.find(u => u.id === userId);
}

// Helper function to get sprint by ID
function getSprintById(sprintId) {
    return sprints.find(s => s.id === sprintId);
}

// Helper function to format date
function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Helper function to format date for detail view
function formatDetailDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
