export function createProviderCards() {
  return `
    <div class="provider-cards mb-8">
      <div class="provider-card" id="edpCard">
        <div class="provider-header">
          <img
            src="assets/images/edp_logo.png"
            alt="EDP Logo"
            class="provider-logo"
          />
          <h3 class="provider-name">EDP</h3>
        </div>
        <div class="provider-details">
          <div class="detail-item">
            <span class="detail-label">Tarifa Simples</span>
            <span class="detail-value">0,1650 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Bi-horário (Ponta)</span>
            <span class="detail-value">0,1850 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Bi-horário (Fora Ponta)</span>
            <span class="detail-value">0,1250 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Potência (kVA)</span>
            <span class="detail-value">0,0950 €/kVA/dia</span>
          </div>
        </div>
      </div>

      <div class="provider-card" id="endesaCard">
        <div class="provider-header">
          <img
            src="assets/images/endesa_logo.png"
            alt="Endesa Logo"
            class="provider-logo"
          />
          <h3 class="provider-name">Endesa</h3>
        </div>
        <div class="provider-details">
          <div class="detail-item">
            <span class="detail-label">Tarifa Simples</span>
            <span class="detail-value">0,1550 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Bi-horário (Ponta)</span>
            <span class="detail-value">0,1750 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Bi-horário (Fora Ponta)</span>
            <span class="detail-value">0,1150 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Potência (kVA)</span>
            <span class="detail-value">0,0850 €/kVA/dia</span>
          </div>
        </div>
      </div>

      <div class="provider-card" id="repsolCard">
        <div class="provider-header">
          <img
            src="assets/images/repsol_logo.png"
            alt="Repsol Logo"
            class="provider-logo"
          />
          <h3 class="provider-name">Repsol</h3>
        </div>
        <div class="provider-details">
          <div class="detail-item">
            <span class="detail-label">Tarifa Simples</span>
            <span class="detail-value">0,1750 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Bi-horário (Ponta)</span>
            <span class="detail-value">0,1950 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Bi-horário (Fora Ponta)</span>
            <span class="detail-value">0,1350 €/kWh</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Potência (kVA)</span>
            <span class="detail-value">0,1050 €/kVA/dia</span>
          </div>
        </div>
      </div>
    </div>
  `;
} 