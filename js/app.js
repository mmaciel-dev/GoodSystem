// ===========================
// APPLICATION STATE & STORAGE
// ===========================
let currentUser = null;
let currentView = 'requirements'; // requirements, approval, reports
let currentReqId = null; // For comment form
let currentFilters = {
    status: '',
    priority: '',
    sprint: '',
    search: ''
};
let currentPage = 1;
const itemsPerPage = 9;
const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;
const USER_STORY_MAX_LENGTH = 500;
let filteredRequirements = [...requirements];

// ===========================
// STORAGE UTILITIES (RNF-4: Auto-save & Versioning)
// ===========================
const STORAGE_KEY_REQUIREMENTS = 'goodsystem_requirements';
const STORAGE_KEY_AUDIT_LOG = 'goodsystem_audit_log';
const STORAGE_KEY_COMMENTS = 'goodsystem_comments';

function loadDataFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_REQUIREMENTS);
        if (stored) {
            requirements = JSON.parse(stored);
            filteredRequirements = [...requirements];
            console.log('✓ Requirements loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function saveDataToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY_REQUIREMENTS, JSON.stringify(requirements));
        console.log('✓ Requirements saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showToast('warning', 'Aviso', 'Não foi possível salvar dados localmente');
    }
}

function saveAuditLog() {
    try {
        localStorage.setItem(STORAGE_KEY_AUDIT_LOG, JSON.stringify(auditLog));
    } catch (error) {
        console.error('Error saving audit log:', error);
    }
}

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load persisted data from localStorage (RNF-4)
    loadDataFromStorage();
    
    // Set current user
    currentUser = users[0]; // João Silva as default user
    
    // Setup login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Setup navigation menu
    setupNavigation();
    
    // Setup new requirement button
    const newReqBtn = document.getElementById('new-requirement-btn');
    if (newReqBtn) {
        newReqBtn.addEventListener('click', () => openModal('new-requirement-modal'));
    }
    
    // Setup new requirement form
    const newReqForm = document.getElementById('new-requirement-form');
    if (newReqForm) {
        newReqForm.addEventListener('submit', handleCreateRequirement);
    }
    
    // Setup filters
    setupFilters();
    
    // Setup search
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    
    // Setup modal close buttons
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = btn.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Setup character counters
    setupCharacterCounters();
    
    // Setup tabs
    setupTabs();
    
    // Setup edit form
    setupEditForm();
}

// ===========================
// AUTHENTICATION
// ===========================
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validação (RNF-7: Auth Segura)
    if (!validateEmail(email)) {
        showToast('error', 'Email inválido', 'Por favor, insira um email válido (RFC 5322)');
        return;
    }
    
    if (password.length < 6) {
        showToast('error', 'Senha inválida', 'Senha deve ter no mínimo 6 caracteres');
        return;
    }
    
    // Find user by email (case-insensitive)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        showToast('error', 'Acesso negado', 'Email ou senha incorretos');
        return;
    }
    
    // In production: verify password hash (bcrypt)
    // For prototype: accept any password >= 6 chars
    if (email && password) {
        currentUser = user;
        
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard-page').style.display = 'grid';
        
        // Atualizar UI com dados do usuário
        updateUserUI();
        
        // Load dashboard
        renderDashboard();
        
        showToast('success', 'Login realizado com sucesso!', `Bem-vindo, ${currentUser.name}`);
    }
}

function validateEmail(email) {
    // RFC 5322 simplified validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateUserUI() {
    const userNameElements = document.querySelectorAll('.user-menu span');
    userNameElements.forEach(el => {
        if (!el.classList.contains('notification-badge')) {
            el.textContent = currentUser.name;
        }
    });
    
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(el => {
        el.src = currentUser.avatar;
        el.alt = currentUser.name;
    });
}

function handleLogout() {
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
    currentUser = null;
    currentView = 'requirements';
    showToast('info', 'Logout realizado', 'Até logo!');
}

// ===========================
// NAVIGATION (Fluxos 1-6)
// ===========================
function setupNavigation() {
    document.querySelectorAll('.navbar-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            switchView(page);
        });
    });
}

function switchView(view) {
    currentView = view;
    
    // Update active state in navbar
    document.querySelectorAll('.navbar-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === view) {
            item.classList.add('active');
        }
    });
    
    // Reset filters and page
    currentPage = 1;
    
    // Show/hide search bar based on view
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.style.display = (view === 'requirements' || view === 'kanban') ? 'flex' : 'none';
    }
    
    // Render appropriate view
    switch(view) {
        case 'requirements':
            renderDashboard();
            break;
        case 'kanban':
            renderKanbanView();
            break;
        case 'approval':
            renderApprovalView();
            break;
        case 'reports':
            renderReportsView();
            break;
    }
}

// ===========================
// DASHBOARD RENDERING
// ===========================
function renderDashboard() {
    // Reset grid style for cards
    const grid = document.getElementById('requirements-grid');
    if (grid) {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
    }
    
    updateContentHeader('Requisitos do Sistema', true);
    applyFilters();
    renderRequirements();
    updateStats();
    renderPagination();
}

function updateContentHeader(title, showNewButton) {
    const header = document.querySelector('.content-header h1');
    const newBtn = document.getElementById('new-requirement-btn');
    
    if (header) header.textContent = title;
    if (newBtn) newBtn.style.display = showNewButton ? 'inline-flex' : 'none';
}

function renderRequirements() {
    const grid = document.getElementById('requirements-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReqs = filteredRequirements.slice(startIndex, endIndex);
    
    if (paginatedReqs.length === 0) {
        grid.innerHTML = '<p class="text-center text-gray" style="grid-column: 1 / -1; padding: 3rem;">Nenhum requisito encontrado.</p>';
        return;
    }
    
    paginatedReqs.forEach(req => {
        const card = createRequirementCard(req);
        grid.appendChild(card);
    });
}

function createRequirementCard(req) {
    const card = document.createElement('div');
    card.className = 'requirement-card';
    card.onclick = () => openRequirementDetail(req.id);
    
    const assignee = req.assignee ? getUserById(req.assignee) : null;
    const sprint = req.sprint ? getSprintById(req.sprint) : null;
    
    card.innerHTML = `
        <div class="card-header">
            <span class="card-id">${req.id}</span>
            <span class="badge badge-${req.status}">${getStatusLabel(req.status)}</span>
        </div>
        <h3 class="card-title">${req.title}</h3>
        <p class="card-description">${req.description}</p>
        <div class="card-meta">
            <span class="badge badge-${req.priority}">${getPriorityLabel(req.priority)}</span>
            ${sprint ? `<span class="tag">${sprint.name}</span>` : ''}
            ${req.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
            ${req.tags.length > 2 ? `<span class="tag">+${req.tags.length - 2}</span>` : ''}
        </div>
        <div class="card-footer">
            <div class="card-assignee">
                ${assignee ? `
                    <img src="${assignee.avatar}" alt="${assignee.name}">
                    <span>${assignee.name}</span>
                ` : '<span class="text-gray">Não atribuído</span>'}
            </div>
            <div class="card-info">
                <span>💬 ${req.commentsCount}</span>
                <span>📎 ${req.attachmentsCount}</span>
            </div>
        </div>
    `;
    
    return card;
}

// ===========================
// KANBAN VIEW
// ===========================
function renderKanbanView() {
    updateContentHeader('Visualização Kanban', true);
    applyFilters();
    updateStats();
    
    const grid = document.getElementById('requirements-grid');
    if (!grid) return;
    
    // Hide pagination for kanban view
    const pagination = document.getElementById('pagination');
    if (pagination) pagination.style.display = 'none';
    
    // Change grid to kanban board layout
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    grid.style.gap = '1rem';
    grid.innerHTML = '';
    
    // Define status columns
    const columns = [
        { id: 'draft', label: 'Rascunho', color: 'gray' },
        { id: 'pending', label: 'Pendente', color: 'warning' },
        { id: 'approved', label: 'Aprovado', color: 'success' },
        { id: 'rejected', label: 'Rejeitado', color: 'danger' }
    ];
    
    // Create kanban columns
    columns.forEach(column => {
        const columnReqs = filteredRequirements.filter(req => req.status === column.id);
        const columnElement = createKanbanColumn(column, columnReqs);
        grid.appendChild(columnElement);
    });
}

function createKanbanColumn(column, requirements) {
    const columnDiv = document.createElement('div');
    columnDiv.className = 'kanban-column';
    columnDiv.setAttribute('data-status', column.id);
    
    columnDiv.innerHTML = `
        <div class="kanban-column-header">
            <h3>${column.label}</h3>
            <span class="badge badge-${column.color}">${requirements.length}</span>
        </div>
        <div class="kanban-column-body" data-status="${column.id}">
            ${requirements.length === 0 ? 
                '<p class="kanban-empty">Nenhum requisito</p>' : 
                requirements.map(req => createKanbanCard(req)).join('')
            }
        </div>
    `;
    
    return columnDiv;
}

function createKanbanCard(req) {
    const assignee = req.assignee ? getUserById(req.assignee) : null;
    const sprint = req.sprint ? getSprintById(req.sprint) : null;
    
    return `
        <div class="kanban-card" data-req-id="${req.id}" onclick="openRequirementDetail('${req.id}')">
            <div class="kanban-card-header">
                <span class="kanban-card-id">${req.id}</span>
                <span class="badge badge-${req.priority}">${getPriorityLabel(req.priority)}</span>
            </div>
            <h4 class="kanban-card-title">${req.title}</h4>
            ${req.userStory ? `<p class="kanban-card-user-story">📖 ${req.userStory.substring(0, 80)}${req.userStory.length > 80 ? '...' : ''}</p>` : ''}
            <div class="kanban-card-meta">
                ${sprint ? `<span class="tag">${sprint.name}</span>` : ''}
                ${req.tags.slice(0, 1).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="kanban-card-footer">
                ${assignee ? `
                    <img src="${assignee.avatar}" alt="${assignee.name}" class="kanban-avatar">
                ` : '<span class="text-gray-small">N/A</span>'}
                <div class="kanban-card-info">
                    <span>💬 ${req.commentsCount}</span>
                    <span>📎 ${req.attachmentsCount}</span>
                </div>
            </div>
            <button class="kanban-move-btn" onclick="event.stopPropagation(); showMoveMenu('${req.id}', '${req.status}')">
                ⋮
            </button>
        </div>
    `;
}

function showMoveMenu(reqId, currentStatus) {
    const statuses = [
        { id: 'draft', label: 'Rascunho' },
        { id: 'pending', label: 'Pendente' },
        { id: 'approved', label: 'Aprovado' },
        { id: 'rejected', label: 'Rejeitado' }
    ];
    
    const options = statuses
        .filter(s => s.id !== currentStatus)
        .map(s => s.label)
        .join('\n');
    
    const choice = prompt(`Mover requisito para:\n\n${options}\n\nDigite o número:\n1 - Rascunho\n2 - Pendente\n3 - Aprovado\n4 - Rejeitado`);
    
    if (choice) {
        const statusMap = { '1': 'draft', '2': 'pending', '3': 'approved', '4': 'rejected' };
        const newStatus = statusMap[choice];
        
        if (newStatus && newStatus !== currentStatus) {
            moveRequirementStatus(reqId, newStatus);
        }
    }
}

function moveRequirementStatus(reqId, newStatus) {
    const req = requirements.find(r => r.id === reqId);
    if (!req) return;
    
    const oldStatus = req.status;
    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    
    // Add to audit log
    if (!auditLog[reqId]) auditLog[reqId] = [];
    auditLog[reqId].push({
        id: `audit-${Date.now()}`,
        action: 'status_changed',
        user: currentUser.id,
        details: `Status alterado de ${getStatusLabel(oldStatus)} para ${getStatusLabel(newStatus)}`,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage (RNF-4: Persistência)
    saveDataToStorage();
    saveAuditLog();
    
    // Refresh kanban view
    renderKanbanView();
    
    showToast('success', 'Status atualizado', `${reqId} movido para ${getStatusLabel(newStatus)}`);
}

// ===========================
// APPROVAL VIEW (Fluxo 4)
// ===========================
function renderApprovalView() {
    updateContentHeader('Portal de Aprovação', false);
    
    // Filter only pending requirements
    filteredRequirements = requirements.filter(r => r.status === 'pending');
    
    const grid = document.getElementById('requirements-grid');
    if (!grid) return;
    
    // Reset grid for single column
    grid.style.gridTemplateColumns = '1fr';
    grid.innerHTML = '';
    
    if (filteredRequirements.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
                <h2 style="color: var(--gray-600); margin-bottom: 0.5rem;">Nenhuma aprovação pendente</h2>
                <p style="color: var(--gray-500);">Todos os requisitos foram revisados!</p>
            </div>
        `;
        updateStats();
        return;
    }
    
    filteredRequirements.forEach(req => {
        const card = createApprovalCard(req);
        grid.appendChild(card);
    });
    
    updateStats();
    
    // Hide pagination in approval view
    const pagination = document.getElementById('pagination');
    if (pagination) pagination.innerHTML = '';
}

function createApprovalCard(req) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.borderLeft = '4px solid var(--warning)';
    card.style.maxWidth = '900px';
    card.style.margin = '0 auto 1.5rem';
    
    const creator = getUserById(req.createdBy);
    const daysAgo = Math.floor((new Date() - new Date(req.createdAt)) / (1000 * 60 * 60 * 24));
    const sprint = req.sprint ? getSprintById(req.sprint) : null;
    
    card.innerHTML = `
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span class="card-id" style="font-size: 1rem;">${req.id}</span>
                <span class="badge badge-pending" style="margin-left: 0.5rem;">⏰ Pendente há ${daysAgo} dia${daysAgo !== 1 ? 's' : ''}</span>
            </div>
            <span class="badge badge-${req.priority}">${getPriorityLabel(req.priority)}</span>
        </div>
        <div class="card-body">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--primary);">${req.title}</h3>
            <p style="color: var(--gray-700); line-height: 1.6; margin-bottom: 1.5rem;">${req.description}</p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: var(--gray-50); border-radius: var(--radius-md);">
                <div>
                    <div style="font-size: 0.75rem; color: var(--gray-500); text-transform: uppercase; margin-bottom: 0.25rem;">Solicitado por</div>
                    <div style="font-weight: 600; color: var(--gray-900);">${creator ? creator.name : 'Desconhecido'}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${creator ? creator.email : ''}</div>
                </div>
                <div>
                    <div style="font-size: 0.75rem; color: var(--gray-500); text-transform: uppercase; margin-bottom: 0.25rem;">Sprint</div>
                    <div style="font-weight: 600; color: var(--gray-900);">${sprint ? sprint.name : 'Não atribuído'}</div>
                </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.75rem; color: var(--gray-500); text-transform: uppercase; margin-bottom: 0.5rem;">Tags</div>
                <div class="tag-group">
                    ${req.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            ${req.commentsCount > 0 ? `
                <div style="padding: 0.75rem; background: var(--gray-50); border-left: 3px solid var(--primary); border-radius: var(--radius-sm); margin-bottom: 1rem;">
                    <span style="font-weight: 600;">💬 ${req.commentsCount} comentário${req.commentsCount !== 1 ? 's' : ''}</span> na discussão
                </div>
            ` : ''}
        </div>
        <div class="card-footer" style="display: flex; gap: 0.75rem; background: white;">
            <button class="btn btn-success" style="flex: 1;" onclick="event.stopPropagation(); handleApproval('${req.id}', 'approved')">
                ✓ Aprovar Requisito
            </button>
            <button class="btn btn-danger" style="flex: 1;" onclick="event.stopPropagation(); handleApproval('${req.id}', 'rejected')">
                ✕ Rejeitar com Comentário
            </button>
            <button class="btn btn-secondary" onclick="event.stopPropagation(); openRequirementDetail('${req.id}')">
                👁️ Ver Detalhes
            </button>
        </div>
    `;
    
    return card;
}

function handleApproval(reqId, action) {
    const req = requirements.find(r => r.id === reqId);
    if (!req) return;
    
    if (action === 'rejected') {
        const reason = prompt('Por favor, informe o motivo da rejeição:\n(Obrigatório para rastreabilidade)');
        if (!reason || reason.trim() === '') {
            showToast('warning', 'Rejeição cancelada', 'Motivo é obrigatório para rejeitar requisitos');
            return;
        }
        
        // Add rejection comment (RN-2: Rastreabilidade)
        if (!comments[reqId]) comments[reqId] = [];
        comments[reqId].push({
            id: `comment-${Date.now()}`,
            author: currentUser.id,
            content: `❌ **Requisito rejeitado**\n\nMotivo: ${reason}`,
            createdAt: new Date().toISOString()
        });
        req.commentsCount++;
    }
    
    // Update requirement status
    req.status = action;
    req.updatedAt = new Date().toISOString();
    
    // Add to audit log (RN-2: Rastreabilidade Total)
    if (!auditLog[reqId]) auditLog[reqId] = [];
    auditLog[reqId].unshift({
        id: `audit-${Date.now()}`,
        action: 'status_change',
        user: currentUser.id,
        details: `Status alterado de "Pendente" para "${getStatusLabel(action)}"`,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage (RNF-4: Persistência)
    saveDataToStorage();
    saveAuditLog();
    
    // Close detail modal
    closeModal('detail-modal');
    
    // Show rejection details modal if rejected
    if (action === 'rejected') {
        showRejectionDetails(reqId);
    } else {
        // Show notification for approval
        const actionLabel = 'aprovado';
        showToast('success', 
            `Requisito ${actionLabel}!`, 
            `${req.id} foi ${actionLabel} com sucesso. Equipe será notificada.`);
    }
    
    // Reload view
    renderApprovalView();
}

// ===========================
// REPORTS VIEW (Fluxo 5)
// ===========================
function renderReportsView() {
    updateContentHeader('Relatórios e Análises', false);
    // Garantir que estatísticas usem o dataset completo
    filteredRequirements = [...requirements];
    
    const grid = document.getElementById('requirements-grid');
    if (!grid) return;
    
    // Calculate statistics
    const stats = {
        total: requirements.length,
        approved: requirements.filter(r => r.status === 'approved').length,
        pending: requirements.filter(r => r.status === 'pending').length,
        rejected: requirements.filter(r => r.status === 'rejected').length,
        draft: requirements.filter(r => r.status === 'draft').length
    };
    
    const priorityStats = {
        high: requirements.filter(r => r.priority === 'high').length,
        medium: requirements.filter(r => r.priority === 'medium').length,
        low: requirements.filter(r => r.priority === 'low').length
    };
    
    // Count by sprint
    const sprintStats = {};
    sprints.forEach(sprint => {
        sprintStats[sprint.id] = requirements.filter(r => r.sprint === sprint.id).length;
    });
    
    // Count by assignee
    const assigneeStats = {};
    users.forEach(user => {
        assigneeStats[user.id] = requirements.filter(r => r.assignee === user.id).length;
    });
    
    // Calculate percentages
    const approvedPct = stats.total > 0 ? Math.round(stats.approved/stats.total*100) : 0;
    const pendingPct = stats.total > 0 ? Math.round(stats.pending/stats.total*100) : 0;
    const rejectedPct = stats.total > 0 ? Math.round(stats.rejected/stats.total*100) : 0;
    
    grid.style.gridTemplateColumns = '1fr';
    grid.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div class="card">
                    <div class="card-body" style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--primary);">${stats.total}</div>
                        <div style="color: var(--gray-600); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 1px;">Total de Requisitos</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body" style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--success);">${stats.approved}</div>
                        <div style="color: var(--gray-600); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 1px;">✓ Aprovados (${approvedPct}%)</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body" style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--warning);">${stats.pending}</div>
                        <div style="color: var(--gray-600); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 1px;">⏰ Pendentes (${pendingPct}%)</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body" style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--danger);">${stats.rejected}</div>
                        <div style="color: var(--gray-600); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 1px;">✕ Rejeitados (${rejectedPct}%)</div>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                <div class="card">
                    <div class="card-header" style="background: var(--gray-50);">
                        <h3 style="margin: 0; font-size: 1.125rem;">📊 Distribuição por Prioridade</h3>
                    </div>
                    <div class="card-body">
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600;">Alta</span>
                                <span>${priorityStats.high} (${Math.round(priorityStats.high/stats.total*100)}%)</span>
                            </div>
                            <div style="height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; width: ${priorityStats.high/stats.total*100}%; background: var(--danger); transition: width 0.3s;"></div>
                            </div>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600;">Média</span>
                                <span>${priorityStats.medium} (${Math.round(priorityStats.medium/stats.total*100)}%)</span>
                            </div>
                            <div style="height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; width: ${priorityStats.medium/stats.total*100}%; background: var(--warning); transition: width 0.3s;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600;">Baixa</span>
                                <span>${priorityStats.low} (${Math.round(priorityStats.low/stats.total*100)}%)</span>
                            </div>
                            <div style="height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; width: ${priorityStats.low/stats.total*100}%; background: var(--primary); transition: width 0.3s;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header" style="background: var(--gray-50);">
                        <h3 style="margin: 0; font-size: 1.125rem;">📅 Requisitos por Sprint</h3>
                    </div>
                    <div class="card-body">
                        ${sprints.map(sprint => {
                            const count = sprintStats[sprint.id] || 0;
                            return `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--gray-200);">
                                    <div>
                                        <div style="font-weight: 600;">${sprint.name}</div>
                                        <div style="font-size: 0.75rem; color: var(--gray-500);">${sprint.startDate} a ${sprint.endDate}</div>
                                    </div>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${count}</div>
                                </div>
                            `;
                        }).join('')}
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
                            <div>
                                <div style="font-weight: 600;">Sem Sprint</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Não atribuídos</div>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--gray-500);">${requirements.filter(r => !r.sprint).length}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header" style="background: var(--gray-50);">
                    <h3 style="margin: 0; font-size: 1.125rem;">👥 Top Responsáveis</h3>
                </div>
                <div class="card-body">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--gray-200);">
                                <th style="text-align: left; padding: 0.75rem; font-weight: 600;">Responsável</th>
                                <th style="text-align: left; padding: 0.75rem; font-weight: 600;">Role</th>
                                <th style="text-align: center; padding: 0.75rem; font-weight: 600;">Requisitos</th>
                                <th style="text-align: right; padding: 0.75rem; font-weight: 600;">% do Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => {
                                const count = assigneeStats[user.id] || 0;
                                const percentage = stats.total > 0 ? Math.round(count/stats.total*100) : 0;
                                return `
                                    <tr style="border-bottom: 1px solid var(--gray-200);">
                                        <td style="padding: 0.75rem;">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <img src="${user.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
                                                <span style="font-weight: 600;">${user.name}</span>
                                            </div>
                                        </td>
                                        <td style="padding: 0.75rem; color: var(--gray-600);">${user.role}</td>
                                        <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: var(--primary);">${count}</td>
                                        <td style="padding: 0.75rem; text-align: right;">${percentage}%</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn btn-primary" onclick="exportReportPDF()">
                    📄 Exportar Relatório (PDF)
                </button>
                <button class="btn btn-secondary" onclick="exportReportCSV()">
                    📊 Exportar Dados (CSV)
                </button>
                <div class="stub-note" style="margin-top: 0.75rem; justify-content: center;">Exportação em formato CSV ou JSON está disponível</div>
            </div>
        </div>
    `;
    
    // Hide pagination
    const pagination = document.getElementById('pagination');
    if (pagination) pagination.innerHTML = '';
    
    updateStats();
}

// ===========================
// FILTERS
// ===========================
function setupFilters() {
    const filterStatus = document.getElementById('filter-status');
    const filterPriority = document.getElementById('filter-priority');
    const filterSprint = document.getElementById('filter-sprint');
    const clearBtn = document.getElementById('clear-filters');
    
    if (filterStatus) {
        filterStatus.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentPage = 1;
            if (currentView === 'requirements') renderDashboard();
        });
    }
    
    if (filterPriority) {
        filterPriority.addEventListener('change', (e) => {
            currentFilters.priority = e.target.value;
            currentPage = 1;
            if (currentView === 'requirements') renderDashboard();
        });
    }
    
    if (filterSprint) {
        filterSprint.addEventListener('change', (e) => {
            currentFilters.sprint = e.target.value;
            currentPage = 1;
            if (currentView === 'requirements') renderDashboard();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            currentFilters = { status: '', priority: '', sprint: '', search: '' };
            filterStatus.value = '';
            filterPriority.value = '';
            filterSprint.value = '';
            document.getElementById('search-input').value = '';
            currentPage = 1;
            if (currentView === 'requirements') renderDashboard();
            showToast('info', 'Filtros limpos', 'Exibindo todos os requisitos');
        });
    }
}

function applyFilters() {
    filteredRequirements = requirements.filter(req => {
        if (currentFilters.status && req.status !== currentFilters.status) return false;
        if (currentFilters.priority && req.priority !== currentFilters.priority) return false;
        if (currentFilters.sprint && req.sprint !== currentFilters.sprint) return false;
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            return req.title.toLowerCase().includes(searchLower) ||
                   req.description.toLowerCase().includes(searchLower) ||
                   req.id.toLowerCase().includes(searchLower) ||
                   req.tags.some(tag => tag.toLowerCase().includes(searchLower));
        }
        return true;
    });
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    currentFilters.search = searchInput.value;
    currentPage = 1;
    if (currentView === 'requirements') renderDashboard();
}

// ===========================
// STATISTICS
// ===========================
function updateStats() {
    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statApproved = document.getElementById('stat-approved');
    
    if (statTotal) statTotal.textContent = filteredRequirements.length;
    if (statPending) statPending.textContent = filteredRequirements.filter(r => r.status === 'pending').length;
    if (statApproved) statApproved.textContent = filteredRequirements.filter(r => r.status === 'approved').length;
}

// ===========================
// PAGINATION
// ===========================
function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.onclick = () => changePage(i);
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.padding = '0 8px';
            pagination.appendChild(ellipsis);
        }
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextBtn);
}

function changePage(page) {
    currentPage = page;
    renderRequirements();
    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================
// MODAL MANAGEMENT
// ===========================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ===========================
// REQUIREMENT DETAIL (Fluxo 3)
// ===========================
function openRequirementDetail(reqId) {
    const req = requirements.find(r => r.id === reqId);
    if (!req) return;
    
    currentReqId = reqId; // Store for comment form
    
    const modal = document.getElementById('detail-modal');
    const title = document.getElementById('detail-title');
    
    if (title) {
        title.textContent = `${req.id}: ${req.title}`;
    }
    
    // Reset to first tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const firstTab = document.querySelector('[data-tab="info"]');
    if (firstTab) firstTab.classList.add('active');
    const firstPane = document.getElementById('tab-info');
    if (firstPane) firstPane.classList.add('active');
    
    // Load all tabs
    loadDetailInfo(req);
    loadComments(reqId);
    loadHistory(reqId);
    loadAttachments(reqId);
    
    // Update tab badges
    updateTabBadges(reqId);
    
    // Setup action buttons
    setupDetailActions(req);
    
    // Setup comment form
    setupCommentForm(reqId);
    
    openModal('detail-modal');
}

function updateTabBadges(reqId) {
    const req = requirements.find(r => r.id === reqId);
    if (!req) return;
    
    const commentsTab = document.querySelector('[data-tab="comments"]');
    if (commentsTab) {
        let badge = commentsTab.querySelector('.badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'badge';
            badge.style.marginLeft = '0.5rem';
            commentsTab.appendChild(badge);
        }
        badge.textContent = req.commentsCount;
    }
    
    const attachmentsTab = document.querySelector('[data-tab="attachments"]');
    if (attachmentsTab) {
        let badge = attachmentsTab.querySelector('.badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'badge';
            badge.style.marginLeft = '0.5rem';
            attachmentsTab.appendChild(badge);
        }
        badge.textContent = req.attachmentsCount;
    }
}

function setupDetailActions(req) {
    const editBtn = document.getElementById('edit-requirement-btn');
    const deleteBtn = document.getElementById('delete-requirement-btn');
    
    if (editBtn) {
        editBtn.onclick = () => {
            openEditModal(req.id);
        };
    }
    
    if (deleteBtn) {
        deleteBtn.onclick = () => {
            if (confirm(`Deseja realmente excluir o requisito ${req.id}?\n\nEsta ação não pode ser desfeita.`)) {
                deleteRequirement(req.id);
            }
        };
    }
}

function loadDetailInfo(req) {
    const detailContent = document.getElementById('detail-content');
    if (!detailContent) return;
    
    const assignee = req.assignee ? getUserById(req.assignee) : null;
    const sprint = req.sprint ? getSprintById(req.sprint) : null;
    const creator = getUserById(req.createdBy);
    
    detailContent.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Status</div>
            <div class="detail-value">
                <span class="badge badge-${req.status}">${getStatusLabel(req.status)}</span>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Prioridade</div>
            <div class="detail-value">
                <span class="badge badge-${req.priority}">${getPriorityLabel(req.priority)}</span>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Tipo</div>
            <div class="detail-value">${getTypeLabel(req.type)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Sprint</div>
            <div class="detail-value">${sprint ? sprint.name : 'Não atribuído'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Responsável</div>
            <div class="detail-value">
                ${assignee ? `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <img src="${assignee.avatar}" alt="${assignee.name}" style="width: 32px; height: 32px; border-radius: 50%;">
                        <div>
                            <div style="font-weight: 600;">${assignee.name}</div>
                            <div style="font-size: 0.875rem; color: var(--gray-600);">${assignee.role}</div>
                        </div>
                    </div>
                ` : 'Não atribuído'}
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Descrição</div>
            <div class="detail-value">${req.description}</div>
        </div>
        ${req.userStory ? `
        <div class="detail-row">
            <div class="detail-label">📖 História de Usuário</div>
            <div class="detail-value" style="background: var(--gray-50); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent); font-style: italic;">
                ${req.userStory}
            </div>
        </div>
        ` : ''}
        <div class="detail-row">
            <div class="detail-label">Tags</div>
            <div class="detail-value">
                <div class="tag-group">
                    ${req.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Criado por</div>
            <div class="detail-value">${creator ? creator.name : 'Desconhecido'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Criado em</div>
            <div class="detail-value">${formatDetailDate(req.createdAt)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Última atualização</div>
            <div class="detail-value">${formatDetailDate(req.updatedAt)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Versão</div>
            <div class="detail-value">v${req.version}</div>
        </div>
    `;
}

function loadComments(reqId) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    const reqComments = comments[reqId] || [];
    
    if (reqComments.length === 0) {
        commentsList.innerHTML = '<p class="text-gray" style="text-align: center; padding: 2rem;">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
        return;
    }
    
    commentsList.innerHTML = reqComments.map(comment => {
        const author = getUserById(comment.author);
        return `
            <div class="comment">
                <div class="comment-header">
                    <img src="${author.avatar}" alt="${author.name}" class="comment-avatar">
                    <div style="flex: 1;">
                        <div class="comment-author">${author.name}</div>
                        <div class="comment-date">${formatDate(comment.createdAt)}</div>
                    </div>
                </div>
                <div class="comment-body" style="white-space: pre-wrap;">${comment.content}</div>
            </div>
        `;
    }).join('');
}

function setupCommentForm(reqId) {
    const commentForm = document.querySelector('.comment-form');
    if (!commentForm) return;
    
    const textarea = document.getElementById('new-comment');
    const submitBtn = commentForm.querySelector('.btn');
    
    if (submitBtn) {
        // Remove previous listeners
        const newBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newBtn, submitBtn);
        
        newBtn.onclick = () => {
            if (!textarea || !textarea.value.trim()) {
                showToast('warning', 'Comentário vazio', 'Por favor, escreva um comentário');
                return;
            }
            
            const content = textarea.value.trim();
            
            // Add comment (Fluxo 6: Comunicação)
            if (!comments[reqId]) comments[reqId] = [];
            comments[reqId].push({
                id: `comment-${Date.now()}`,
                author: currentUser.id,
                content: content,
                createdAt: new Date().toISOString()
            });
            
            // Update requirement
            const req = requirements.find(r => r.id === reqId);
            if (req) {
                req.commentsCount++;
                req.updatedAt = new Date().toISOString();
            }
            
            // Add to audit log
            if (!auditLog[reqId]) auditLog[reqId] = [];
            auditLog[reqId].unshift({
                id: `audit-${Date.now()}`,
                action: 'commented',
                user: currentUser.id,
                details: 'Novo comentário adicionado',
                timestamp: new Date().toISOString()
            });
            
            // Clear and reload
            textarea.value = '';
            loadComments(reqId);
            updateTabBadges(reqId);
            showToast('success', 'Comentário adicionado', 'Seu comentário foi publicado com sucesso');
        };
    }
}

function loadHistory(reqId) {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    const reqHistory = auditLog[reqId] || [];
    
    if (reqHistory.length === 0) {
        historyList.innerHTML = '<p class="text-gray">Nenhum histórico disponível.</p>';
        return;
    }
    
    historyList.innerHTML = reqHistory.map(entry => {
        const user = getUserById(entry.user);
        const icon = getActionIcon(entry.action);
        return `
            <div class="history-item">
                <div class="history-icon">${icon}</div>
                <div class="history-content">
                    <div class="history-action">${entry.details}</div>
                    <div class="history-details">Por ${user ? user.name : 'Sistema'}</div>
                    <div class="history-date">${formatDate(entry.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function loadAttachments(reqId) {
    const attachmentsList = document.getElementById('attachments-list');
    if (!attachmentsList) return;
    
    const reqAttachments = attachments[reqId] || [];
    
    if (reqAttachments.length === 0) {
        attachmentsList.innerHTML = '<p class="text-gray">Nenhum anexo.</p>';
        return;
    }
    
    attachmentsList.innerHTML = reqAttachments.map(att => {
        const icon = getFileIcon(att.type);
        const uploader = getUserById(att.uploadedBy);
        return `
            <div class="attachment-item">
                <div class="attachment-icon">${icon}</div>
                <div class="attachment-info">
                    <div class="attachment-name">${att.name}</div>
                    <div class="attachment-meta">
                        ${att.size} • Enviado por ${uploader ? uploader.name : 'Desconhecido'} em ${formatDate(att.uploadedAt)}
                    </div>
                </div>
                <div class="attachment-actions">
                    <button class="btn btn-sm btn-ghost" title="Ação simulada no protótipo">⬇️ Baixar (stub)</button>
                </div>
            </div>
        `;
    }).join('') + '<div class="stub-note" style="margin-top: var(--spacing-md);">Download de anexos é apenas simulado neste protótipo</div>';
}

// ===========================
// CREATE REQUIREMENT (Fluxo 2: Gestão)
// ===========================
function handleCreateRequirement(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const userStory = formData.get('userStory');
    
    // Validações (RNF-2: Resposta <3s)
    if (!title || title.length < 5) {
        showToast('error', 'Título inválido', 'Título deve ter no mínimo 5 caracteres');
        return;
    }
    
    if (title.length > TITLE_MAX_LENGTH) {
        showToast('error', 'Título muito longo', `Título deve ter no máximo ${TITLE_MAX_LENGTH} caracteres`);
        return;
    }
    
    if (!description || description.length < 20) {
        showToast('error', 'Descrição inválida', 'Descrição deve ter no mínimo 20 caracteres para rastreabilidade');
        return;
    }
    
    if (description.length > DESCRIPTION_MAX_LENGTH) {
        showToast('error', 'Descrição muito longa', `Descrição deve ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres`);
        return;
    }
    
    if (userStory && userStory.length > 500) {
        showToast('error', 'História de usuário muito longa', 'História de usuário deve ter no máximo 500 caracteres');
        return;
    }
    
    const newReq = {
        id: getNextRequirementId(),
        title: title,
        description: description,
        userStory: userStory || null,
        type: formData.get('type'),
        status: 'draft',
        priority: formData.get('priority'),
        sprint: formData.get('sprint') || null,
        assignee: formData.get('assignee') || null,
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()).filter(t => t) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.id,
        version: '1.0',
        commentsCount: 0,
        attachmentsCount: 0
    };
    
    requirements.unshift(newReq);
    
    // Add to audit log (RN-2: Rastreabilidade Total)
    auditLog[newReq.id] = [{
        id: `audit-${Date.now()}`,
        action: 'created',
        user: currentUser.id,
        details: 'Requisito criado',
        timestamp: new Date().toISOString()
    }];
    
    // Save to localStorage (RNF-4: Versionamento Automático)
    saveDataToStorage();
    saveAuditLog();
    
    closeModal('new-requirement-modal');
    e.target.reset();
    
    // Reset character counters
    const titleCounter = document.querySelector('#req-title + .char-count');
    const descCounter = document.querySelector('#req-description + .char-count');
    const userStoryCounter = document.querySelector('#req-user-story + .char-count');
    if (titleCounter) titleCounter.textContent = `0/${TITLE_MAX_LENGTH}`;
    if (descCounter) descCounter.textContent = `0/${DESCRIPTION_MAX_LENGTH}`;
    if (userStoryCounter) userStoryCounter.textContent = `0/${USER_STORY_MAX_LENGTH}`;
    
    if (currentView === 'requirements') {
        renderDashboard();
    }
    
    showToast('success', 'Requisito criado!', `${newReq.id} foi criado com sucesso`);
}

// ===========================
// DELETE REQUIREMENT
// ===========================
function deleteRequirement(reqId) {
    const index = requirements.findIndex(r => r.id === reqId);
    if (index !== -1) {
        requirements.splice(index, 1);
        
        // Clean up related data
        delete comments[reqId];
        delete auditLog[reqId];
        delete attachments[reqId];
        
        closeModal('detail-modal');
        
        // Refresh current view
        if (currentView === 'requirements') {
            renderDashboard();
        } else if (currentView === 'approval') {
            renderApprovalView();
        } else if (currentView === 'reports') {
            renderReportsView();
        }
        
        showToast('success', 'Requisito excluído', `${reqId} foi removido com sucesso`);
    }
}

// ===========================
// CHARACTER COUNTERS
// ===========================
function setupCharacterCounters() {
    const titleInput = document.getElementById('req-title');
    const descInput = document.getElementById('req-description');
    const userStoryInput = document.getElementById('req-user-story');
    
    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            const counter = e.target.nextElementSibling;
            if (counter && counter.classList.contains('char-count')) {
                counter.textContent = `${e.target.value.length}/${TITLE_MAX_LENGTH}`;
                // Mudar cor se exceder limite
                if (e.target.value.length > TITLE_MAX_LENGTH) {
                    counter.style.color = 'var(--danger)';
                    e.target.style.borderColor = 'var(--danger)';
                } else {
                    counter.style.color = 'var(--gray-500)';
                    e.target.style.borderColor = 'var(--gray-300)';
                }
            }
        });
    }
    
    if (descInput) {
        descInput.addEventListener('input', (e) => {
            const counter = e.target.nextElementSibling;
            if (counter && counter.classList.contains('char-count')) {
                counter.textContent = `${e.target.value.length}/${DESCRIPTION_MAX_LENGTH}`;
                // Mudar cor se exceder limite
                if (e.target.value.length > DESCRIPTION_MAX_LENGTH) {
                    counter.style.color = 'var(--danger)';
                    e.target.style.borderColor = 'var(--danger)';
                } else {
                    counter.style.color = 'var(--gray-500)';
                    e.target.style.borderColor = 'var(--gray-300)';
                }
            }
        });
    }
    
    if (userStoryInput) {
        userStoryInput.addEventListener('input', (e) => {
            const counter = e.target.nextElementSibling;
            if (counter && counter.classList.contains('char-count')) {
                counter.textContent = `${e.target.value.length}/${USER_STORY_MAX_LENGTH}`;
                // Mudar cor se exceder limite
                if (e.target.value.length > USER_STORY_MAX_LENGTH) {
                    counter.style.color = 'var(--danger)';
                    e.target.style.borderColor = 'var(--danger)';
                } else {
                    counter.style.color = 'var(--gray-500)';
                    e.target.style.borderColor = 'var(--gray-300)';
                }
            }
        });
    }
}

// ===========================
// TABS
// ===========================
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            
            // Remove active from all tabs
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            // Add active to clicked tab
            e.target.classList.add('active');
            const pane = document.getElementById(`tab-${tabName}`);
            if (pane) {
                pane.classList.add('active');
            }
        });
    });
}

// ===========================
// TOAST NOTIFICATIONS
// ===========================
function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }[type];
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">×</button>
    `;
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.onclick = () => toast.remove();
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ===========================
// HELPER FUNCTIONS
// ===========================
function getNextRequirementId() {
    // Garante que novos IDs não colidam mesmo após exclusões
    const existingIds = new Set(requirements.map(r => r.id));
    const maxSeq = requirements.reduce((max, req) => {
        const match = req.id.match(/REQ-(\d+)/);
        const seq = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, seq);
    }, 0);
    let nextSeq = maxSeq + 1;
    let nextId = `REQ-${String(nextSeq).padStart(3, '0')}`;
    while (existingIds.has(nextId)) {
        nextSeq += 1;
        nextId = `REQ-${String(nextSeq).padStart(3, '0')}`;
    }
    return nextId;
}

function getStatusLabel(status) {
    const labels = {
        draft: 'Rascunho',
        pending: 'Pendente',
        approved: 'Aprovado',
        rejected: 'Rejeitado'
    };
    return labels[status] || status;
}

function getPriorityLabel(priority) {
    const labels = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa'
    };
    return labels[priority] || priority;
}

function getTypeLabel(type) {
    const labels = {
        functional: 'Funcional',
        'non-functional': 'Não Funcional',
        technical: 'Técnico'
    };
    return labels[type] || type;
}

function getActionIcon(action) {
    const icons = {
        created: '➕',
        updated: '✏️',
        assigned: '👤',
        status_change: '🔄',
        version: '📦',
        commented: '💬'
    };
    return icons[action] || '•';
}

function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type === 'application/json') return '📋';
    return '📎';
}

// ===========================
// EXPORT FUNCTIONS (RNF-4: Relatórios)
// ===========================
function exportReportCSV() {
    // Header
    let csv = 'ID,Título,Descrição,Tipo,Status,Prioridade,Sprint,Responsável,Criado Em,Atualizado Em,Versão\n';
    
    // Data rows
    requirements.forEach(req => {
        const assignee = req.assignee ? users.find(u => u.id === req.assignee)?.name || 'N/A' : 'Não atribuído';
        const sprint = req.sprint ? req.sprint : 'Sem Sprint';
        const row = [
            `"${req.id}"`,
            `"${req.title.replace(/"/g, '""')}"`,
            `"${req.description.replace(/"/g, '""').substring(0, 100)}"`,
            `"${req.type}"`,
            `"${req.status}"`,
            `"${req.priority}"`,
            `"${sprint}"`,
            `"${assignee}"`,
            `"${new Date(req.createdAt).toLocaleString('pt-BR')}"`,
            `"${new Date(req.updatedAt).toLocaleString('pt-BR')}"`,
            `"${req.version}"`
        ];
        csv += row.join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `goodsystem-relatorio-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Exportação concluída', 'Relatório CSV exportado com sucesso');
}

function exportReportPDF() {
    // PDF export using browser print dialog
    // Alternative: Use library like jsPDF for advanced features
    
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Build HTML content
    let htmlContent = `
    <html>
    <head>
        <title>GoodSystem - Relatório de Requisitos</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 2rem; color: #333; }
            h1 { color: #003366; border-bottom: 2px solid #00CC66; padding-bottom: 0.5rem; }
            h2 { color: #003366; margin-top: 1.5rem; margin-bottom: 0.75rem; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
            th { background-color: #003366; color: white; padding: 0.75rem; text-align: left; }
            td { padding: 0.5rem; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem; }
            .metric-card { background-color: #f5f5f5; padding: 1rem; border-radius: 4px; text-align: center; }
            .metric-value { font-size: 2rem; font-weight: bold; color: #003366; }
            .metric-label { color: #666; font-size: 0.9rem; margin-top: 0.5rem; }
            .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.9rem; color: #999; }
        </style>
    </head>
    <body>
        <h1>GoodSystem Requirements Analyzer</h1>
        <p><strong>Data do Relatório:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <p><strong>Gerado por:</strong> ${currentUser.name}</p>
        
        <h2>Métricas Gerais</h2>
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">${requirements.length}</div>
                <div class="metric-label">Total de Requisitos</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${requirements.filter(r => r.status === 'approved').length}</div>
                <div class="metric-label">Aprovados</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${requirements.filter(r => r.status === 'pending').length}</div>
                <div class="metric-label">Pendentes</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${requirements.filter(r => r.status === 'rejected').length}</div>
                <div class="metric-label">Rejeitados</div>
            </div>
        </div>
        
        <h2>Requisitos por Status</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Responsável</th>
            </tr>
    `;
    
    // Add requirements to table
    requirements.forEach(req => {
        const assignee = req.assignee ? users.find(u => u.id === req.assignee)?.name || 'N/A' : 'Não atribuído';
        htmlContent += `
            <tr>
                <td>${req.id}</td>
                <td>${req.title}</td>
                <td>${req.status}</td>
                <td>${req.priority}</td>
                <td>${assignee}</td>
            </tr>
        `;
    });
    
    htmlContent += `
        </table>
        <div class="footer">
            <p>Relatório gerado automaticamente pelo GoodSystem Requirements Analyzer</p>
            <p>© 2026 JIT Technology. Todos os direitos reservados.</p>
        </div>
    </body>
    </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    
    showToast('success', 'Relatório pronto para imprimir', 'Use Ctrl+P ou File > Print para salvar como PDF');
}

// ===========================
// EXTERNAL INTEGRATIONS (Phase 2.0)
// ===========================
// Interface 1: GitHub API
const GitHubIntegration = {
    enabled: false,
    baseURL: 'https://api.github.com',
    description: 'Integração com GitHub para referenciar commits, issues e PRs nos requisitos',
    features: [
        'Vincular commits a requisitos',
        'Referenciar issues do GitHub',
        'Rastrear PRs relacionadas',
        'Sincronizar status automaticamente'
    ],
    async linkCommit(reqId, commitSha) {
        console.log('🔗 [GitHub] Linking commit', commitSha, 'to requirement', reqId);
        showToast('info', 'GitHub', 'Integração GitHub será disponibilizada em v2.0');
        // TODO: Implementar com GitHub API + OAuth
    }
};

// Interface 2: Slack API
const SlackIntegration = {
    enabled: false,
    baseURL: 'https://hooks.slack.com/services',
    description: 'Notificações automáticas sobre atualizações, comentários ou aprovações',
    features: [
        'Notificações de aprovação',
        'Alertas de requisitos críticos',
        'Atualizações em tempo real',
        'Integração com canais dedicados'
    ],
    async sendNotification(channel, message) {
        console.log('📢 [Slack] Sending notification to', channel);
        showToast('info', 'Slack', 'Integração Slack será disponibilizada em v2.0');
        // TODO: Implementar com Slack Webhooks
    }
};

// Interface 3: SendGrid (Email Service)
const SendGridIntegration = {
    enabled: false,
    baseURL: 'https://api.sendgrid.com/v3',
    description: 'Emails para aprovações, relatórios e alertas',
    features: [
        'Email de aprovação de requisitos',
        'Notificações de mudanças de status',
        'Envio de relatórios automatizados',
        'Alertas para requisitos vencidos'
    ],
    async sendEmail(to, subject, template) {
        console.log('📧 [SendGrid] Sending email to', to);
        showToast('info', 'Email', 'Integração SendGrid será disponibilizada em v2.0');
        // TODO: Implementar com SendGrid API
    }
};

// Interface 4: GitLab API
const GitLabIntegration = {
    enabled: false,
    baseURL: 'https://gitlab.com/api/v4',
    description: 'Similar ao GitHub, para ambientes alternativos',
    features: [
        'Vincular commits GitLab',
        'Referenciar issues GitLab',
        'Rastrear MRs (Merge Requests)',
        'Sincronizar com projetos GitLab'
    ],
    async linkMergeRequest(reqId, mrId) {
        console.log('🔗 [GitLab] Linking MR', mrId, 'to requirement', reqId);
        showToast('info', 'GitLab', 'Integração GitLab será disponibilizada em v2.0');
        // TODO: Implementar com GitLab API
    }
};

// Integration status display
function showIntegrationStatus() {
    console.log('═════════════════════════════════════════');
    console.log('📡 INTEGRATIONS STATUS (v2.0)');
    console.log('═════════════════════════════════════════');
    console.log('✓ GitHub API:', GitHubIntegration.enabled ? 'ATIVO' : 'PLANEJADO');
    console.log('✓ Slack API:', SlackIntegration.enabled ? 'ATIVO' : 'PLANEJADO');
    console.log('✓ SendGrid:', SendGridIntegration.enabled ? 'ATIVO' : 'PLANEJADO');
    console.log('✓ GitLab API:', GitLabIntegration.enabled ? 'ATIVO' : 'PLANEJADO');
    console.log('═════════════════════════════════════════');
}

// ===========================
// EDIT REQUIREMENT MODAL (Fluxo 6: Edição e Rejeição)
// ===========================
let currentEditReqId = null;
let currentRejectionReqId = null;

function openEditModal(reqId) {
    const req = requirements.find(r => r.id === reqId);
    if (!req) return;
    
    currentEditReqId = reqId;
    
    // Fill form fields
    document.getElementById('edit-req-id').value = req.id;
    document.getElementById('edit-req-status').value = getStatusLabel(req.status);
    document.getElementById('edit-req-version').value = req.version || '1.0';
    
    document.getElementById('edit-req-title').value = req.title;
    document.getElementById('edit-req-description').value = req.description;
    document.getElementById('edit-req-user-story').value = req.userStory || '';
    document.getElementById('edit-req-type').value = req.type;
    document.getElementById('edit-req-priority').value = req.priority;
    document.getElementById('edit-req-sprint').value = req.sprint || '';
    document.getElementById('edit-req-assignee').value = req.assignee || '';
    document.getElementById('edit-req-tags').value = Array.isArray(req.tags) ? req.tags.join(', ') : (req.tags || '');
    
    // Update char counters
    updateEditCharCounter(document.getElementById('edit-req-title'), 120);
    updateEditCharCounter(document.getElementById('edit-req-description'), 1000);
    updateEditCharCounter(document.getElementById('edit-req-user-story'), 500);
    
    openModal('edit-requirement-modal');
}

function updateEditCharCounter(inputElement, maxLength) {
    if (!inputElement) return;
    
    const countSpan = inputElement.parentElement.querySelector('.char-count');
    if (countSpan) {
        countSpan.textContent = `${inputElement.value.length}/${maxLength}`;
    }
}

function handleEditRequirement(e) {
    e.preventDefault();
    
    const titleInput = document.getElementById('edit-req-title');
    const descriptionInput = document.getElementById('edit-req-description');
    
    // Validations
    if (!titleInput.value || titleInput.value.trim().length < 5) {
        showToast('error', 'Validação', 'Título deve ter no mínimo 5 caracteres');
        return;
    }
    
    if (!descriptionInput.value || descriptionInput.value.trim().length < 20) {
        showToast('error', 'Validação', 'Descrição deve ter no mínimo 20 caracteres');
        return;
    }
    
    // Find requirement
    const req = requirements.find(r => r.id === currentEditReqId);
    if (!req) return;
    
    // Store old values for audit log
    const oldValues = {
        title: req.title,
        description: req.description,
        userStory: req.userStory,
        type: req.type,
        priority: req.priority,
        sprint: req.sprint,
        assignee: req.assignee,
        tags: req.tags ? req.tags.join(', ') : ''
    };
    
    // Update fields
    req.title = document.getElementById('edit-req-title').value;
    req.description = document.getElementById('edit-req-description').value;
    req.userStory = document.getElementById('edit-req-user-story').value;
    req.type = document.getElementById('edit-req-type').value;
    req.priority = document.getElementById('edit-req-priority').value;
    req.sprint = document.getElementById('edit-req-sprint').value;
    req.assignee = document.getElementById('edit-req-assignee').value;
    req.tags = document.getElementById('edit-req-tags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');
    
    // Update version
    if (req.version) {
        const parts = req.version.split('.');
        parts[1] = (parseInt(parts[1] || 0) + 1).toString();
        req.version = parts.join('.');
    } else {
        req.version = '1.1';
    }
    
    req.updatedAt = new Date().toISOString();
    
    // If was rejected, change to pending for resubmission
    const wasRejected = req.status === 'rejected';
    if (wasRejected) {
        req.status = 'pending';
    }
    
    // Add to audit log
    if (!auditLog[currentEditReqId]) auditLog[currentEditReqId] = [];
    
    const changes = [];
    if (oldValues.title !== req.title) changes.push(`Título alterado`);
    if (oldValues.description !== req.description) changes.push(`Descrição atualizada`);
    if (oldValues.userStory !== req.userStory) changes.push(`História de usuário modificada`);
    if (oldValues.type !== req.type) changes.push(`Tipo alterado para ${req.type}`);
    if (oldValues.priority !== req.priority) changes.push(`Prioridade alterada para ${getPriorityLabel(req.priority)}`);
    if (oldValues.sprint !== req.sprint) changes.push(`Sprint alterado`);
    if (oldValues.assignee !== req.assignee) changes.push(`Responsável alterado`);
    
    auditLog[currentEditReqId].unshift({
        id: `audit-${Date.now()}`,
        action: 'updated',
        user: currentUser.id,
        details: `Requisito editado (v${req.version}): ${changes.join('; ')}${wasRejected ? ' | Resubmetido para aprovação' : ''}`,
        timestamp: new Date().toISOString()
    });
    
    // Save to storage
    saveDataToStorage();
    saveAuditLog();
    
    // Show success message
    const resubmitMsg = wasRejected ? ' e resubmetido para aprovação' : '';
    showToast('success', 'Requisito atualizado!', `${req.id} foi atualizado com sucesso (v${req.version})${resubmitMsg}`);
    
    // Close modals
    closeModal('edit-requirement-modal');
    closeModal('rejection-modal');
    
    // Reload views
    if (currentView === 'requirements') {
        filterAndRenderRequirements();
    } else if (currentView === 'approval') {
        renderApprovalView();
    } else if (currentView === 'kanban') {
        renderKanbanView();
    }
    
    // Reload detail modal if it's open
    if (document.getElementById('detail-modal').style.display !== 'none') {
        openRequirementDetail(currentEditReqId);
    }
}

function showRejectionDetails(reqId) {
    const req = requirements.find(r => r.id === reqId);
    if (!req) return;
    
    currentRejectionReqId = reqId;
    
    // Find rejection comment
    const reqComments = comments[reqId] || [];
    const rejectionComment = reqComments.find(c => c.content.includes('❌ **Requisito rejeitado**'));
    
    let rejectionReason = 'Nenhum motivo foi especificado';
    if (rejectionComment) {
        const reasonMatch = rejectionComment.content.match(/Motivo: ([\s\S]*?)(?:\n\n|$)/);
        if (reasonMatch) {
            rejectionReason = reasonMatch[1].trim();
        }
    }
    
    // Fill rejection modal
    document.getElementById('rejection-req-id').textContent = req.id;
    document.getElementById('rejection-date').textContent = formatDate(req.updatedAt);
    document.getElementById('rejection-reason').textContent = rejectionReason;
    
    openModal('rejection-modal');
}

function setupEditForm() {
    const form = document.getElementById('edit-requirement-form');
    if (!form) return;
    
    form.addEventListener('submit', handleEditRequirement);
    
    // Setup char counters for edit modal
    const titleInput = document.getElementById('edit-req-title');
    const descriptionInput = document.getElementById('edit-req-description');
    const userStoryInput = document.getElementById('edit-req-user-story');
    
    if (titleInput) {
        titleInput.addEventListener('input', () => updateEditCharCounter(titleInput, 120));
    }
    
    if (descriptionInput) {
        descriptionInput.addEventListener('input', () => updateEditCharCounter(descriptionInput, 1000));
    }
    
    if (userStoryInput) {
        userStoryInput.addEventListener('input', () => updateEditCharCounter(userStoryInput, 500));
    }
}

function getPriorityLabel(priority) {
    const labels = {
        'high': 'Alta',
        'medium': 'Média',
        'low': 'Baixa'
    };
    return labels[priority] || priority;
}
