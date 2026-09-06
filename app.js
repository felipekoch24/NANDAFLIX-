// ==========================================
// NANDAFLIX+ - SCRIPT PRINCIPAL (app.js)
// ==========================================

let allStories = [];
let videoEmReproducao = null;

// Executa assim que a página é carregada
document.addEventListener("DOMContentLoaded", () => {
    loadStories();
});

// --- 1. CARREGAR VÍDEOS DO JSON ---
async function loadStories() {
    try {
        const response = await fetch('videos.json');
        allStories = await response.json();
        renderStories(allStories);
        renderRecents(allStories);
    } catch (error) {
        console.error("Erro ao carregar o videos.json:", error);
        const feedContainer = document.getElementById('feed-container');
        if (feedContainer) {
            feedContainer.innerHTML = "<p style='color: #f87171; text-align: center; margin-top: 20px;'>Erro ao carregar os episódios.</p>";
        }
    }
}

// --- 2. RENDERIZAR FEED DE EPISÓDIOS (COM BLOQUEIO SÓ DO 01.mp4) ---
function renderStories(stories) {
    const feedContainer = document.getElementById('feed-container');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = '';
    
    const agora = new Date();
    const dia = agora.getDate();
    const mes = agora.getMonth() + 1;
    const ehDiaDoAniversario = (mes > 9 || (mes === 9 && dia >= 7));

    // Esconde apenas o 01.mp4 se não for dia 7. Outros vídeos passam livremente!
    const storiesFiltrados = stories.filter(story => {
        if (!ehDiaDoAniversario && story.src === "01.mp4") {
            return false;
        }
        return true;
    });

    if (storiesFiltrados.length === 0) {
        feedContainer.innerHTML = "<p style='color: #a78bfa; text-align: center; margin-top: 20px;'>Nenhum episódio disponível ainda.</p>";
        return;
    }

    const grouped = {};
    storiesFiltrados.forEach(story => {
        const cat = story.categoria || "Outros Momentos";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(story);
    });

    for (const [categoria, items] of Object.entries(grouped)) {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';

        const titleElem = document.createElement('h3');
        titleElem.className = 'category-title';
        titleElem.textContent = categoria;
        categorySection.appendChild(titleElem);

        items.forEach(story => {
            categorySection.appendChild(createStoryElement(story));
        });

        feedContainer.appendChild(categorySection);
    }
}

// --- 3. RENDERIZAR ABA DE RECENTES ---
function renderRecents(stories) {
    const recentContainer = document.getElementById('recent-container');
    if (!recentContainer) return;
    
    recentContainer.innerHTML = '';
    
    const agora = new Date();
    const dia = agora.getDate();
    const mes = agora.getMonth() + 1;
    const ehDiaDoAniversario = (mes > 9 || (mes === 9 && dia >= 7));

    const storiesFiltrados = stories.filter(story => {
        if (!ehDiaDoAniversario && story.src === "01.mp4") {
            return false;
        }
        return true;
    });

    if (storiesFiltrados.length === 0) {
        recentContainer.innerHTML = "<p style='color: #a78bfa; text-align: center; margin-top: 20px;'>Nenhum episódio recente.</p>";
        return;
    }

    const recentStories = [...storiesFiltrados].reverse();
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';

    const titleElem = document.createElement('h3');
    titleElem.className = 'category-title';
    titleElem.textContent = "🔥 Últimos Adicionados";
    categorySection.appendChild(titleElem);

    recentStories.forEach(story => {
        categorySection.appendChild(createStoryElement(story));
    });

    recentContainer.appendChild(categorySection);
}

// --- 4. CRIAR ELEMENTO HTML DE CADA VÍDEO ---
function createStoryElement(story) {
    const storyDiv = document.createElement('div');
    storyDiv.className = 'story-container';
    storyDiv.innerHTML = `
        <div class="video-box">
            <video src="${story.src}" loop controls controlsList="nodownload"></video>
        </div>
        <div class="story-content">
            <h2>${story.titulo}</h2>
            <blockquote>"${story.citacao}"</blockquote>
            <p>${story.descricao}</p>
            <button class="like-btn" onclick="toggleLike(this)">
                <span>💜</span> Favoritar Episódio
            </button>
        </div>
    `;

    const videoElem = storyDiv.querySelector('video');
    videoElem.addEventListener('play', function() {
        if (videoEmReproducao && videoEmReproducao !== videoElem) {
            videoEmReproducao.pause();
        }
        videoEmReproducao = videoElem;
    });

    return storyDiv;
}

// --- 5. BOTÃO DE FAVORITAR ---
function toggleLike(btn) {
    btn.classList.toggle('liked');
    if (btn.classList.contains('liked')) {
        btn.innerHTML = '<span>💜</span> Favoritado!';
    } else {
        btn.innerHTML = '<span>💜</span> Favoritar Episódio';
    }
}

// --- 6. SISTEMA DE PESQUISA ---
function filterStories() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filtered = allStories.filter(story => 
        story.titulo.toLowerCase().includes(searchTerm) || 
        story.descricao.toLowerCase().includes(searchTerm) ||
        story.citacao.toLowerCase().includes(searchTerm) ||
        (story.categoria && story.categoria.toLowerCase().includes(searchTerm))
    );
    renderStories(filtered);
    renderRecents(filtered);
}

// --- 7. NAVEGAÇÃO ENTRE ABAS ---
function openTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    if (btn) btn.classList.add('active');
    
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        if (tabId === 'support') {
            searchContainer.style.display = 'none';
        } else {
            searchContainer.style.display = 'block';
        }
    }
}

// --- 8. MODAL DA FOTO DE PERFIL ---
function abrirModalFoto() {
    const modal = document.getElementById('imageModal');
    const avatar = document.querySelector('.dev-avatar');
    const modalImg = document.getElementById('modalImg');
    
    if (modal && avatar && modalImg) {
        modalImg.src = avatar.src;
        modal.style.display = 'flex';
    }
}

function fecharModalFoto() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.style.display = 'none';
}

// --- 9. BOTÃO DE VOLTAR AO TOPO ---
window.onscroll = function() {
    const btnTopo = document.getElementById("btnTopo");
    if (!btnTopo) return;

    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnTopo.style.display = "flex";
    } else {
        btnTopo.style.display = "none";
    }
};

function voltarAoTopo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
