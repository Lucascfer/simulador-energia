import { TARIFF_VALUES, COMPANIES, GAS_PRICES } from "../constants.js";
import { updateCardValues } from "../ui.js";

export function createProviderCards() {
  const cardsHTML = `
    <div class="provider-cards mb-8">
      ${COMPANIES.map(
        (company) => {
          const cardId = `${company.toLowerCase()}Card`;
          return `
            <div class="provider-card" id="${cardId}">
              <div class="provider-header" onclick="toggleProviderCard('${cardId}')">
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
          `;
        }
      ).join("")}
    </div>
  `;

  // Disparar um evento personalizado quando os cards forem criados
  setTimeout(() => {
    const event = new CustomEvent('providerCardsCreated');
    document.dispatchEvent(event);
  }, 0);

  return cardsHTML;
}

// Função para alternar a visibilidade do card
export function toggleProviderCard(cardId) {
  const card = document.getElementById(cardId);
  if (!card) {
    console.warn(`Card not found: ${cardId}`);
    return;
  }

  const details = card.querySelector('.provider-details');
  const toggleIcon = card.querySelector('.toggle-icon');
  
  if (!details || !toggleIcon) {
    console.warn(`Required elements not found in card: ${cardId}`);
    return;
  }

  const isHidden = details.style.display === 'none';
  details.style.display = isHidden ? 'block' : 'none';
  toggleIcon.textContent = isHidden ? '▲' : '▼';
}

// Função para atualizar os valores do gás
export function updateGasEscalao(escalao) {
  const power = document.getElementById('power')?.value || 0;
  const tariffType = document.querySelector('input[name="tariffType"]:checked')?.value || 'simples';
  updateCardValues(power, tariffType);
}

// Adicionar funções ao escopo global para compatibilidade
window.toggleProviderCard = toggleProviderCard;
window.updateGasEscalao = updateGasEscalao;
