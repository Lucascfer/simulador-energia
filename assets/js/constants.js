// Companies and their configurations
export const COMPANIES = ["EDP", "Endesa", "Repsol"];

// Power costs table (€/kVA/day)
export const POWER_COSTS = {
  EDP: {
    1.15: 0.1367,
    "2.30": 0.2464,
    3.45: 0.3413,
    "4.60": 0.5448,
    5.75: 0.6432,
    "6.90": 0.6825,
    10.35: 0.9914,
    "13.80": 1.2959,
    17.25: 1.6982,
    "20.70": 2.0382,
  },
  Endesa: {
    1.15: 0.1646,
    "2.30": 0.2459,
    3.45: 0.3086,
    "4.60": 0.4342,
    5.75: 0.5288,
    "6.90": 0.7069,
    10.35: 0.879,
    "13.80": 1.1742,
    17.25: 1.4899,
    "20.70": 1.9459,
  },
  Repsol: {
    1.15: 0.1729,
    "2.30": 0.2658,
    3.45: 0.2787,
    "4.60": 0.3316,
    5.75: 0.3845,
    "6.90": 0.4374,
    10.35: 0.5961,
    "13.80": 0.7548,
    17.25: 0.9135,
    "20.70": 1.0722,
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

// Natural gas reference prices (€/kWh)
export const GAS_PRICES = {
  EDP: [
    {
      termoFixo: 0.0752,
      energia: 0.0979,
    },
    {
      termoFixo: 0.1114,
      energia: 0.0953,
    },
    {
      termoFixo: 0.1529,
      energia: 0.0936,
    },
    {
      termoFixo: 0.2203,
      energia: 0.0935,
    },
  ],
  Endesa: [
    {
      termoFixo: 0.2055,
      energia: 0.119806,
    },
    {
      termoFixo: 0.286,
      energia: 0.114967,
    },
    {
      termoFixo: 0.4658,
      energia: 0.106603,
    },
    {
      termoFixo: 0.7465,
      energia: 0.105816,
    },
  ],
  Repsol: [
    {
      termoFixo: 0.1347,
      energia: 0.098012,
    },
    {
      termoFixo: 0.1648,
      energia: 0.092886,
    },
    {
      termoFixo: 0.1968,
      energia: 0.089917,
    },
    {
      termoFixo: 0.2419,
      energia: 0.088626,
    },
  ],
};
