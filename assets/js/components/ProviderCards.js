import { TARIFF_VALUES, COMPANIES } from "../constants.js";

export function createProviderCards() {
  return `
    <div class="provider-cards mb-8">
      ${COMPANIES.map(
        (company) => `
        <div class="provider-card" id="${company.toLowerCase()}Card">
          <div class="provider-header">
            <img
              src="assets/images/${company.toLowerCase()}_logo.png"
              alt="${company} Logo"
              class="provider-logo"
            />          </div>
          <div class="provider-details">
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
          </div>
        </div>
      `
      ).join("")}
    </div>
  `;
}
