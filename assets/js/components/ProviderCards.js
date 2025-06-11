import { TARIFF_VALUES, COMPANIES, GAS_PRICES } from "../constants.js";

export function createProviderCards() {
  return `
    <div class="provider-cards mb-8">
      ${COMPANIES.map(
        (company) => `
        <div class="provider-card" id="${company.toLowerCase()}Card">
          <div class="provider-header" onclick="toggleProviderCard('${company.toLowerCase()}Card')">
            <img
              src="assets/images/${company.toLowerCase()}_logo.png"
              alt="${company} Logo"
              class="provider-logo"
            />
            <span class="toggle-icon">▼</span>
          </div>
          <div class="provider-details" style="display: none;">
            <!-- Os detalhes serão preenchidos dinamicamente pelo updateCardValues -->
          </div>
        </div>
      `
      ).join("")}
    </div>
  `;
}

// Função para alternar a visibilidade do card
export function toggleProviderCard(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const details = card.querySelector('.provider-details');
  const toggleIcon = card.querySelector('.toggle-icon');
  
  if (!details || !toggleIcon) return;

  const isHidden = details.style.display === 'none';
  details.style.display = isHidden ? 'block' : 'none';
  toggleIcon.textContent = isHidden ? '▲' : '▼';
}

// Função para atualizar os valores do gás
export function updateGasEscalao(escalao) {
  // Esta função agora apenas dispara a atualização dos cards
  // A lógica real de atualização está em ui.js
  const power = document.getElementById('power')?.value || 0;
  const tariffType = document.querySelector('input[name="tariffType"]:checked')?.value || 'simples';
  
  // Importar e chamar a função do ui.js
  import('../ui.js').then(module => {
    module.updateCardValues(power, tariffType);
  });
}

// Adicionar funções ao escopo global para compatibilidade
window.toggleProviderCard = toggleProviderCard;
window.updateGasEscalao = updateGasEscalao;
