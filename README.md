# GoodSystem Requirements Analyzer

> **Protótipo funcional** de sistema de gestão e análise de requisitos de software

[![Visualizar Demo](https://img.shields.io/badge/demo-vercel-black)](https://good-system.vercel.app/)
[![Status](https://img.shields.io/badge/status-prototype-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 📋 Sobre o Projeto

Este é um **protótipo interativo** que demonstra os principais fluxos e funcionalidades de um sistema completo de gestão de requisitos de software. Desenvolvido com HTML, CSS e JavaScript puro, o projeto exemplifica conceitos de:

- Gestão completa de requisitos
- Fluxo de aprovação integrado
- Rastreabilidade em tempo real
- Relatórios e dashboards analíticos

⚠️ **Importante**: Este é um protótipo conceitual com **dados mocados** para fins demonstrativos. Não há backend ou persistência de dados real.

## ✨ Funcionalidades Demonstradas

### 🔐 Autenticação
- Login simulado com validação de email (RFC 5322)
- Gestão de sessão no front-end
- Interface de usuário personalizada

**Credenciais de teste:**
- Email: `dev@jit.com`
- Senha: `123456`

### 📊 Dashboard de Requisitos
- Visualização em cards com informações resumidas
- Grid responsivo com paginação
- Busca e filtros combinados (status, prioridade, sprint)
- Estatísticas em tempo real na sidebar
- Exibição de badges por status e prioridade

### ➕ Gestão de Requisitos
- Criação de novos requisitos com validação
- Formulário completo com:
  - Título (5-120 caracteres)
  - Descrição (20-1000 caracteres)
  - Tipo (Funcional/Não Funcional/Técnico)
  - Prioridade (Alta/Média/Baixa)
  - Atribuição de sprint e responsável
  - Sistema de tags
- Contadores de caracteres em tempo real
- Exclusão com confirmação

### 🔍 Visualização Detalhada
- Modal com abas organizadas
- **Informações**: Dados completos do requisito
- **Comentários**: Sistema de discussão (3-8 comentários por requisito)
- **Histórico**: Trilha de auditoria completa
- **Anexos**: Visualização de arquivos (simulado)

### ✅ Portal de Aprovação
- Listagem exclusiva de requisitos pendentes
- Cards expandidos com contexto completo
- Aprovação rápida com um clique
- Rejeição com obrigatoriedade de justificativa
- Notificações via toast

### 📈 Relatórios e Análises
- Dashboard com métricas agregadas:
  - Total de requisitos
  - Distribuição por status (aprovados/pendentes/rejeitados)
  - Gráficos de prioridade
  - Requisitos por sprint
  - Top responsáveis
- Botões de exportação (PDF/CSV - simulados)

### 💬 Comunicação e Colaboração
- Sistema de comentários em cada requisito
- Formatação de texto preservada
- Timestamps relativos ("2h atrás", "3d atrás")
- Identificação de autores com avatares

### 📝 Rastreabilidade Total
- Histórico de todas as ações
- Registro de criação, edição e mudanças de status
- Versionamento de requisitos
- Identificação de responsáveis por mudança

## 🎨 Design e UX

- **Design System**: Paleta de cores profissional (azul primário #003366, verde acento #00CC66)
- **Tipografia**: Inter (UI) e Roboto (headings)
- **Responsivo**: Mobile-first com breakpoints em 768px e 1024px
- **Acessibilidade**: Contraste adequado, navegação por teclado
- **Animações**: Transições suaves e feedback visual

## 📊 Dados Demonstrativos

O protótipo inclui:
- **15 requisitos** pré-populados
- **5 usuários** com papéis distintos (PO, Tech Lead, Developer, QA, UX)
- **3 sprints** (Sprint 12, 13, 14)
- **33 comentários** distribuídos
- **17 anexos** simulados
- **19+ entradas** de histórico/auditoria

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, variáveis CSS, animações
- **JavaScript (ES6+)**: Módulos, arrow functions, template literals
- **Fontes**: Google Fonts (Inter, Roboto)
- **Ícones**: Emojis Unicode para leveza

## 🎯 Casos de Uso Demonstrados

### Fluxo 1: Login e Navegação
1. Acesse a aplicação
2. Faça login com as credenciais de teste
3. Navegue entre as abas (Requisitos / Aprovações / Relatórios)

### Fluxo 2: Criação de Requisito
1. Clique em "+ Novo Requisito"
2. Preencha o formulário (observe os contadores)
3. Atribua prioridade, sprint e responsável
4. Adicione tags separadas por vírgula
5. Clique em "Criar Requisito"

### Fluxo 3: Exploração Detalhada
1. Clique em qualquer card de requisito
2. Navegue pelas abas (Informações/Comentários/Histórico/Anexos)
3. Observe a estrutura de dados completa

### Fluxo 4: Aprovação de Requisitos
1. Acesse a aba "Aprovações"
2. Revise os requisitos pendentes
3. Aprove ou rejeite (com justificativa obrigatória)
4. Observe as notificações toast

### Fluxo 5: Análise e Relatórios
1. Acesse a aba "Relatórios"
2. Visualize métricas agregadas
3. Analise distribuições e top responsáveis
4. Teste botões de exportação (simulados)

### Fluxo 6: Colaboração
1. Abra detalhes de um requisito
2. Vá para aba "Comentários"
3. Adicione um novo comentário
4. Observe atualização em tempo real

## 🚧 Limitações Conhecidas (Features Stub)

As seguintes funcionalidades são **apenas demonstrativas**:

- ✏️ **Edição de requisitos**: Exibe toast informativo
- 📎 **Download de anexos**: Botão sem ação real
- 📄 **Exportação PDF/CSV**: Exibe toast informativo
- 📁 **Upload de arquivos**: Não processa arquivos reais
- 🔔 **Notificações**: Contador estático

> Avisos visuais foram incluídos na interface para indicar estas limitações.

## 🎓 Conceitos Demonstrados

### Requisitos Funcionais (RN)
- **RN-1**: CRUD completo de requisitos
- **RN-2**: Rastreabilidade total (histórico + comentários)
- **RN-4**: Fluxo de aprovação com justificativas
- **RN-5**: Notificações via toast
- **RN-6**: Relatórios consolidados

### Requisitos Não-Funcionais (RNF)
- **RNF-2**: Interface responsiva <3s
- **RNF-7**: Autenticação com validação RFC 5322
- **RNF-9**: Design acessível (contraste, navegação)

## 📝 Notas de Implementação

### Validações
- Email: RFC 5322 simplificado
- Título: 5-120 caracteres
- Descrição: 20-1000 caracteres
- Geração de IDs: Sequencial com proteção contra colisões

### Persistência
- Dados mantidos em memória durante a sessão
- Nenhuma informação salva entre recarregamentos
- Ideal para demonstrações e testes de conceito

### Performance
- Renderização otimizada com paginação (9 itens/página)
- Filtros aplicados no front-end
- Timestamps calculados relativamente

## 🤝 Contribuindo

Este é um protótipo educacional. Sugestões e melhorias são bem-vindas via issues ou pull requests!

## 📄 Licença

MIT License - sinta-se livre para usar este protótipo como base para seus projetos.
