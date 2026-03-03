// Função para abrir a galeria
function abrirGaleria(categoria) {
    const modal = document.getElementById("meuModal");
    const lista = document.getElementById("listaMedia");
    const titulo = document.getElementById("tituloGaleria");

    // Vamos buscar os dados ao ficheiro JSON
    fetch('produtos.json')
        .then(response => response.json())
        .then(dados => {
            titulo.innerText = "Trabalhos: " + categoria.toUpperCase();
            lista.innerHTML = ""; 

            dados[categoria].forEach(item => {
                let elemento = item.tipo === 'img' 
                    ? `<img src="${item.url}" class="gallery-item">` 
                    : `<iframe src="${item.url}" allowfullscreen></iframe>`;
                lista.innerHTML += elemento;
            });
            modal.style.display = "block";
        });
}

function fecharGaleria() {
    document.getElementById("meuModal").style.display = "none";
}

// Criar os cartões automaticamente ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("servicos-container");
    const servicos = [
        { id: 'sites', nome: 'Sites', icon: '💻' },
        { id: 'fotos', nome: 'Fotos', icon: '📸' },
        { id: 'videos', nome: 'Vídeos', icon: '🎬' }
    ];

    servicos.forEach(s => {
        container.innerHTML += `
            <div class="card" onclick="abrirGaleria('${s.id}')">
                <span style="font-size:40px">${s.icon}</span>
                <h3>${s.nome}</h3>
                <p>Ver Portfólio</p>
            </div>`;
    });
});
