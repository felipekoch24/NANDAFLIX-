// --- DADOS DOS VÍDEOS (EPISÓDIOS) ---
const episodios = [
    {
        id: 1,
        titulo: "7 de SETEMBRO",
        video: "01.mp4",
        citacao: "O começo de tudo e as melhores memórias que guardamos no coração.",
        texto: "Um dia mais do que especial que merece ser lembrado sempre com muito carinho e sorrisos.",
        data: "2026-09-07",
        recente: true
    }
    // Adicione mais episódios aqui se quiser!
];

// --- CARREGAR CONTEÚDO AO ABRIR A PÁGINA ---
document.addEventListener("DOMContentLoaded", () => {
    carregarFeed();
    carregarRecentes();
});

// --- ALTERAR ABAS ---
function openTab(tabId, element) {
    // Esconde todas as abas
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Remove a classe active de todos os botões
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Mostra a aba escolhida e ativa o botão correspondente
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
}

// --- RENDERIZAR FEED ---
function carregarFeed() {
    const container = document.getElementById('feed-container');
    if (!container) return;

    container.innerHTML = '';
    episodios.forEach(ep => {
        container.innerHTML += `
            <div class="story-container" data-titulo="${ep.titulo.toLowerCase()}">
                <div class="category-section" style="width:100%; margin:0;">
                    <h3 class="category-title">${ep.titulo}</h3>
                </div>
                <div class="video-box">
                    <video src="${ep.video}" controls controlsList="nodownload"></video>
                </div>
                <div class="story-content">
                    <h2>${ep.titulo}</h2>
                    <blockquote>"${ep.citacao}"</blockquote>
                    <p>${ep.texto}</p>
                    <button class="like-btn" onclick="toggleLike(this)">
                        <span>🤍</span> Curtir Momento
                    </button>
                </div>
            </div>
        `;
    });
}

// --- RENDERIZAR ÚLTIMOS ADICIONADOS ---
function carregarRecentes() {
    const container = document.getElementById('recent-container');
    if (!container) return;

    container.innerHTML = '';
    const recentes = episodios.filter(ep => ep.recente);
    
    recentes.forEach(ep => {
        container.innerHTML += `
            <div class="story-container">
                <div class="video-box">
                    <video src="${ep.video}" controls controlsList="nodownload"></video>
                </div>
                <div class="story-content">
                    <h2>${ep.titulo} (Recente)</h2>
                    <p>${ep.texto}</p>
                </div>
            </div>
        `;
    });
}

// --- BOTÃO DE CURTIR ---
function toggleLike(btn) {
    btn.classList.toggle('liked');
    const span = btn.querySelector('span');
    if (btn.classList.contains('liked')) {
        span.textContent = '❤️';
    } else {
        span.textContent = '🤍';
    }
}

// --- PESQUISA ---
function filterStories() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const stories = document.querySelectorAll('.story-container');

    stories.forEach(story => {
        const titulo = story.getAttribute('data-titulo') || '';
        if (titulo.includes(query)) {
            story.style.display = 'block';
        } else {
            story.style.display = 'none';
        }
    });
}

// --- MODAL DA FOTO DOS IRMÃOS ---
function abrirModalFoto() {
    document.getElementById('imageModal').style.display = 'flex';
}

function fecharModalFoto() {
    document.getElementById('imageModal').style.display = 'none';
}

// --- POP-UP DE ANIVERSÁRIO ---
function fecharPopupAniversario() {
    const modal = document.getElementById('aniversarioModal');
    const video = document.getElementById('popupVideo');
    if (modal) modal.style.display = 'none';
    if (video) video.pause();
}

// --- BOTÃO VOLTAR AO TOPO ---
window.onscroll = function() {
    const btn = document.getElementById('btnTopo');
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        if (btn) btn.style.display = 'flex';
    } else {
        if (btn) btn.style.display = 'none';
    }
};

function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
