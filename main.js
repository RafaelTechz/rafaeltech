// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    const containerProdutos = document.getElementById('container-produtos');

    // Função para buscar os produtos do arquivo JSON
    fetch('./produtos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON');
            }
            return response.json();
        })
        .then(produtos => {
            // Limpa a mensagem de "Carregando..."
            containerProdutos.innerHTML = '';

            // Itera sobre cada produto e cria o HTML
            produtos.forEach(produto => {
                const card = document.createElement('div');
                card.className = 'produto-card';

                card.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <div class="produto-info">
                        <h3>${produto.nome}</h3>
                        <p>${produto.descricao}</p>
                        <p class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                        <button onclick="alert('Você clicou em comprar: ${produto.nome}')">Comprar</button>
                    </div>
                `;

                containerProdutos.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            containerProdutos.innerHTML = '<p>Desculpe, não foi possível carregar os produtos.</p>';
        });
});
