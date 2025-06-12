import { TARIFF_VALUES } from "../constants.js";

export function getTariffDetails(company, tariffType, power) {
  if (!TARIFF_VALUES[company]) {
    console.warn(`Tariff values not found for company: ${company}`);
    return null;
  }

  const tariffs = TARIFF_VALUES[company];
  let tarifa;
  switch (tariffType) {
    case "simples":
      if (company === "EDP") {
        if (power < 3.45) {
          return [{ label: "Tarifa Simples", value: tariffs.simples.baixa }];
        }
        return [{ label: "Tarifa Simples", value: tariffs.simples.alta }];
      }

      tariffs.simples
        ? (tarifa = [{ label: "Tarifa Simples", value: tariffs.simples }])
        : null;
      return tarifa;
    case "biHorario":
      return tariffs.biHorario
        ? [
            { label: "Vazio", value: tariffs.biHorario.vazio },
            { label: "Fora do Vazio", value: tariffs.biHorario.foraVazio },
          ]
        : null;
    case "triHorario":
      if (company === "EDP") {
        if (power <= 20.70) {
          return [
            { label: "Ponta", value: tariffs.triHorario.ponta.baixa },
            { label: "Cheia", value: tariffs.triHorario.cheia.baixa },
            { label: "Vazio", value: tariffs.triHorario.vazio.baixa },
          ];
        }
        return [
          { label: "Ponta", value: tariffs.triHorario.ponta.alta },
          { label: "Cheia", value: tariffs.triHorario.cheia.alta },
          { label: "Vazio", value: tariffs.triHorario.vazio.alta },
        ];
      }

      tariffs.triHorario
        ? [
            { label: "Ponta", value: tariffs.triHorario.ponta },
            { label: "Cheia", value: tariffs.triHorario.cheia },
            { label: "Vazio", value: tariffs.triHorario.vazio },
          ]
        : null;
      return tarifa;
    default:
      return null;
  }
}

export function updateTariffFields(tariffType) {
  const fields = ["simplesFields", "biHorarioFields", "triHorarioFields"];
  fields.forEach((field) => {
    const element = document.getElementById(field);
    if (element) {
      element.classList.add("hidden");
    }
  });

  const selectedField = document.getElementById(tariffType + "Fields");
  if (selectedField) {
    selectedField.classList.remove("hidden");
  }
}
