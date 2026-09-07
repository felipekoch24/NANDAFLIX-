// --- VARIÁVEL GLOBAL PARA GUARDAR OS DADOS DO JSON ---
let episodios = [];

// --- CARREGAR O JSON E O CONTEÚDO AO ABRIR A PÁGINA ---
document.addEventListener("DOMContentLoaded", () => {
    fetch('videos.json') // <-- Nome exato do seu arquivo JSON
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar o arquivo JSON");
            return response.json();
        })
        .then(data => {
            episodios = data;
            carregarFeed();
            carregarRecentes();
        })
        .catch(error => console.error("Aviso:", error));
});

// --- ALTERAR ABAS ---
function openTab(tabId, element) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.display = 'flex';
    }
    element.classList.add('active');
}

// --- RENDERIZAR FEED DE EPISÓDIOS ---
function carregarFeed() {
    const container = document.getElementById('feed-container');
    if (!container) return;

    container.innerHTML = '';
    episodios.forEach(ep => {
        container.innerHTML += `
            <div class="story-container" data-titulo="${ep.titulo.toLowerCase()}">
                <div class="category-section">
                    <h3 class="category-title">${ep.categoria}</h3>
                </div>
                <div class="video-box">
                    <video src="${ep.src}" controls controlsList="nodownload"></video>
                </div>
                <div class="story-content">
                    <h2>${ep.titulo}</h2>
                    <blockquote>"${ep.citacao}"</blockquote>
                    <p>${ep.descricao}</p>
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
    episodios.forEach(ep => {
        container.innerHTML += `
            <div class="story-container">
                <div class="category-section">
                    <h3 class="category-title">${ep.categoria}</h3>
                </div>
                <div class="video-box">
                    <video src="${ep.src}" controls controlsList="nodownload"></video>
                </div>
                <div class="story-content">
                    <h2>${ep.titulo}</h2>
                    <p>${ep.descricao}</p>
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

// --- MODAL DA FOTO ---
function abrirModalFoto() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.style.display = 'flex';
}

function fecharModalFoto() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.style.display = 'none';
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
