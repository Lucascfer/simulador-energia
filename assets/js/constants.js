// Companies and their configurations
export const COMPANIES = ["EDP", "Endesa", "Repsol"];

// Power costs table (€/kVA/day)
export const POWER_COSTS = {
  EDP: {
    1.15: 0.1367,
    2.3: 0.2464,
    3.45: 0.3413,
    4.6: 0.5448,
    5.75: 0.6432,
    6.9: 0.6825,
    10.35: 0.9914,
    13.8: 1.2959,
    17.25: 1.6982,
    20.7: 2.0382,
  },
  Endesa: {
    1.15: 0.1646,
    2.3: 0.2459,
    3.45: 0.3086,
    4.6: 0.4342,
    5.75: 0.5288,
    6.9: 0.7069,
    10.35: 0.879,
    13.8: 1.1742,
    17.25: 1.4899,
    20.7: 1.9459,
  },
  Repsol: {
    1.15: 0.1729,
    2.3: 0.2658,
    3.45: 0.2787,
    4.6: 0.3316,
    5.75: 0.3845,
    6.9: 0.4374,
    10.35: 0.5961,
    13.8: 0.7548,
    17.25: 0.9135,
    20.7: 1.0722,
  },
};

// Tariff values
export const TARIFF_VALUES = {
  EDP: {
    simples: 0.1627,
    biHorario: { vazio: 0.1161, foraVazio: 0.1921 },
    triHorario: { vazio: 0.1315, ponta: 0.4121, cheia: 0.1653 },
  },
  Endesa: {
    simples: 0.193682,
    biHorario: { vazio: 0.236366, foraVazio: 0.162749 },
    triHorario: { vazio: 0.164709, ponta: 0.437679, cheia: 0.196262 },
  },
  Repsol: {
    simples: 0.175459,
    biHorario: { vazio: 0.109674, foraVazio: 0.208193 },
    triHorario: { vazio: 0.109674, ponta: 0.208193, cheia: 0.208193 },
  },
};

// Natural gas reference prices (€/m³)
export const GAS_PRICES = {
  EDP: 0.065,
  Endesa: 0.063,
  Repsol: 0.067,
};
