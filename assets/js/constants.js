// Companies and their configurations
export const COMPANIES = ["Endesa", "Repsol"];

// Companies and their configurations
export const DISCOUNTS = {
  EDP: {
    powerDiscount: false, // EDP does not have a power discount
    lightDiscount: true, // EDP has a light discount
    fixedTerm: false, // EDP does not have a fixed power cost
    gasDiscount: true, // EDP has a gas discount
  },
  Endesa: {
    powerDiscount: true, // Endesa has a power discount
    lightDiscount: true, // Endesa has a light discount
    fixedTerm: true, // Endesa has a fixed power cost
    gasDiscount: true, // Endesa has a gas discount
  },
  Repsol: {
    powerDiscount: false, // Repsol does not have a power discount
    lightDiscount: true, // Repsol has a light discount
    fixedTerm: false, // Repsol does not have a fixed power cost
    gasDiscount: true, // Repsol has a gas discount
  },
};

export const MORE_THEN_ONE_POWER = {
  EDP: true,
  Endesa: true,
  Repsol: false,
};

export const MORE_THEN_ONE_TARIFF = {
  EDP: true,
  Endesa: false,
  Repsol: false,
};

// Power costs table (€/kVA/day)
export const POWER_COSTS = {
  EDP: {
    simples: {
      1.15: 0.1367,
      "2.30": 0.2094,
      3.45: 0.2901,
      "4.60": 0.4631,
      5.75: 0.5467,
      "6.90": 0.5801,
      10.35: 0.8427,
      "13.80": 1.1015,
      17.25: 1.4435,
      "20.70": 1.7325,
    },
    biHorario: {
      3.45: 0.4439,
      "4.60": 0.5721,
      5.75: 0.6765,
      "6.90": 0.7708,
      10.35: 1.1052,
      "13.80": 1.3402,
      17.25: 1.7391,
      "20.70": 2.1302,
    },
    triHorario: {
      3.45: 0.3372,
      "4.60": 0.4116,
      5.75: 0.4757,
      "6.90": 0.5571,
      10.35: 0.7286,
      "13.80": 1.0093,
      17.25: 1.3157,
      "20.70": 1.5747,
    },
  },
  Endesa: {
    simples: {
      1.15: 0.326,
      "2.30": 0.4303,
      3.45: 0.5151,
      "4.60": 0.6767,
      5.75: 0.7958,
      "6.90": 1.0309,
      10.35: "1.2328",
      "13.80":  1.6062,
      17.25: 2.0088,
      "20.70": 2.6082,
    },
    biHorario: {
      3.45: 0.4883,
      "4.60": 0.5763,
      5.75: 0.6533,
      "6.90": 0.7312,
      10.35: 1.0154,
      "13.80": 1.3492,
      17.25: "1.6510",
      "20.70": 2.0353,
    },
    triHorario: {
      27.60: 2.1484,
      34.50: 2.6735,
      41.40: 3.2771,
    },
  },
  Repsol: {
    1.15: 0.1729,
    "2.30": 0.2258,
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
    simples: {
      baixa: 0.1627,
      alta: 0.1675,
    },
    biHorario: { vazio: 0.1161, foraVazio: 0.1921 },
    triHorario: {
      vazio: { baixa: 0.115257, alta: 0.116597 },
      ponta: { baixa: 0.361134, alta: 0.371237 },
      cheia: { baixa: 0.144845, alta: 0.160824 },
    },
  },
  Endesa: {
    simples: 0.214552,
    biHorario: { vazio: 0.191835, foraVazio: 0.261771 },
    triHorario: { vazio: 0.1697, ponta: 0.4406, cheia: 0.1961 },
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
      termoFixo: 0.0714,
      energia: 0.0979,
    },
    {
      termoFixo: 0.1058,
      energia: 0.0953,
    },
    {
      termoFixo: 0.1453,
      energia: 0.0936,
    },
    {
      termoFixo: 0.2093,
      energia: 0.0935,
    },
  ],
  Endesa: [
    {
      termoFixo: 0.2055,
      energia: 0.1198,
    },
    {
      termoFixo: "0.2860",
      energia: 0.1150,
    },
    {
      termoFixo: 0.4658,
      energia: 0.1066,
    },
    {
      termoFixo: 0.7465,
      energia: 0.1058,
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
