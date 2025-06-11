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
            <div class="detail-item">
              <span class="detail-label">Tarifa Simples</span>
              <span class="detail-value">${TARIFF_VALUES[
                company
              ].simples.toFixed(4)} €/kWh</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Bi-horário (Vazio)</span>
              <span class="detail-value">${TARIFF_VALUES[
                company
              ].biHorario.vazio.toFixed(4)} €/kWh</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Bi-horário (Fora Vazio)</span>
              <span class="detail-value">${TARIFF_VALUES[
                company
              ].biHorario.foraVazio.toFixed(4)} €/kWh</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tri-horário (Vazio)</span>
              <span class="detail-value">${TARIFF_VALUES[
                company
              ].triHorario.vazio.toFixed(4)} €/kWh</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tri-horário (Cheia)</span>
              <span class="detail-value">${TARIFF_VALUES[
                company
              ].triHorario.cheia.toFixed(4)} €/kWh</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tri-horário (Ponta)</span>
              <span class="detail-value">${TARIFF_VALUES[
                company
              ].triHorario.ponta.toFixed(4)} €/kWh</span>
            </div>
            <div class="detail-item gas-details" style="display: none;">
              <span class="detail-label">Gás Natural (Escalão <span class="gas-escalao">1</span>)</span>
              <span class="detail-value gas-energia">${GAS_PRICES[company][0].energia.toFixed(4)} €/kWh</span>
            </div>
            <div class="detail-item gas-termo-fixo-details" style="display: none;">
              <span class="detail-label">Termo Fixo Gás</span>
              <span class="detail-value gas-termo-fixo">${GAS_PRICES[company][0].termoFixo.toFixed(4)} €/mês</span>
            </div>
          </div>
        </div>
      `
      ).join("")}
    </div>
  `;
}

// Add this function to handle the card toggle
window.toggleProviderCard = function(cardId) {
  const card = document.getElementById(cardId);
  const details = card.querySelector('.provider-details');
  const toggleIcon = card.querySelector('.toggle-icon');
  
  if (details.style.display === 'none') {
    details.style.display = 'block';
    toggleIcon.textContent = '▲';
  } else {
    details.style.display = 'none';
    toggleIcon.textContent = '▼';
  }
};

// Add this function to update gas values when escalão changes
window.updateGasEscalao = function(escalao) {
  const gasDetails = document.querySelectorAll('.gas-details');
  const gasEscalaoSpans = document.querySelectorAll('.gas-escalao');
  const gasEnergiaValues = document.querySelectorAll('.gas-energia');
  const gasTermoFixoDetails = document.querySelectorAll('.gas-termo-fixo-details');
  const gasTermoFixoValues = document.querySelectorAll('.gas-termo-fixo');

  gasDetails.forEach((detail, index) => {
    const company = COMPANIES[index];
    const escalaoIndex = parseInt(escalao) - 1;
    
    // Only show gas details if gas is enabled
    if (document.getElementById('simulationType')?.checked) {
      detail.style.display = 'block';
      gasEnergiaValues[index].textContent = `${GAS_PRICES[company][escalaoIndex].energia.toFixed(4)} €/kWh`;

      // Show and update termo fixo details
      gasTermoFixoDetails[index].style.display = 'block';
      gasTermoFixoValues[index].textContent = `${GAS_PRICES[company][escalaoIndex].termoFixo.toFixed(4)} €/mês`;
    } else {
      detail.style.display = 'none';
      gasTermoFixoDetails[index].style.display = 'none';
    }
  });
  
  gasEscalaoSpans.forEach(span => {
    span.textContent = escalao;
  });
};
