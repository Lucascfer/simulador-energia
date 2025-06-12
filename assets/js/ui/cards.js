import { COMPANIES } from "../constants.js";
import { calculateDiscountAmount } from "../calculations.js";
import { createDetailElement, formatNumericValue } from "./utils.js";
import { getTariffDetails } from "./tariffs.js";
import { getGasDetails, createGasDetailsElements } from "./gas.js";

function createDiscountElement(discount) {
  if (!discount || (discount.luz === 0 && discount.gas === 0)) return null;

  const discountContainer = document.createElement("div");
  discountContainer.className = "discount-badge";

  let discountText = "";
  if (discount.luz > 0) {
    discountText += `<span class="discount-item"><i class="fas fa-bolt"></i> ${discount.luz}%</span>`;
  }
  if (discount.gas > 0) {
    discountText += `<span class="discount-item"><i class="fas fa-fire"></i> ${discount.gas}%</span>`;
  }

  discountContainer.innerHTML = discountText;
  return discountContainer;
}

function updateCardDiscounts(
  card,
  company,
  tariffType,
  power,
  directDebit,
  electronicInvoice,
  additionalServices,
  luzGas
) {
  const existingBadge = card.querySelector(".discount-badge");
  if (existingBadge) {
    existingBadge.remove();
  }

  try {
    const discount = calculateDiscountAmount(
      company,
      tariffType,
      power,
      directDebit,
      electronicInvoice,
      additionalServices,
      luzGas
    );

    if (discount && (discount.luz > 0 || discount.gas > 0)) {
      const discountElement = createDiscountElement(discount);
      if (discountElement) {
        const header = card.querySelector(".provider-header");
        if (header) {
          header.appendChild(discountElement);
        }
      }
      card.classList.add("has-discount");
    } else {
      card.classList.remove("has-discount");
    }
  } catch (error) {
    console.warn(`Error calculating discount for ${company}:`, error);
  }
}

function updateCardDetails(
  detailsContainer,
  company,
  tariffType,
  power,
  luzGas
) {
  const fragment = document.createDocumentFragment();

  // Get discount conditions
  const directDebit = document.getElementById("directDebit")?.checked || false;
  const electronicInvoice =
    document.getElementById("electronicInvoice")?.checked || false;
  const additionalServices =
    document.getElementById("additionalServices")?.checked || false;

  // Calculate discounts
  const discount = calculateDiscountAmount(
    company,
    tariffType,
    power,
    directDebit,
    electronicInvoice,
    additionalServices,
    luzGas
  );

  // Add tariff details with discounts
  const tariffDetails = getTariffDetails(company, tariffType, power);
  if (tariffDetails) {
    tariffDetails.forEach((detail) => {
      // Apply energy discount if exists
      const discountedValue = discount?.luz
        ? detail.value * (1 - discount.luz / 100)
        : detail.value;
      fragment.appendChild(
        createDetailElement(
          detail.label,
          discountedValue,
          "€/kWh",
          !!discount?.luz
        )
      );
    });
  }

  // Add gas details if enabled
  if (luzGas) {
    const selectedEscalao =
      document.querySelector('input[name="gasEscalao"]:checked')?.value || "1";
    const gasDetails = getGasDetails(company, selectedEscalao);

    if (gasDetails) {
      // Apply gas discount if exists
      const discountedGasDetails = {
        energia: discount?.gas
          ? gasDetails.energia * (1 - discount.gas / 100)
          : gasDetails.energia
      };

      const gasContainer = createGasDetailsElements(
        company,
        selectedEscalao,
        discountedGasDetails,
        !!discount?.gas
      );
      fragment.appendChild(gasContainer);
    }
  }

  detailsContainer.innerHTML = "";
  detailsContainer.appendChild(fragment);
}

export function updateCardValues(power, tariffType) {
  power = formatNumericValue(power);
  tariffType = tariffType || "simples";

  const directDebit = document.getElementById("directDebit")?.checked || false;
  const electronicInvoice =
    document.getElementById("electronicInvoice")?.checked || false;
  const additionalServices =
    document.getElementById("additionalServices")?.checked || false;
  const luzGas = document.getElementById("simulationType")?.checked || false;

  COMPANIES.forEach((company) => {
    const cardId = `${company.toLowerCase()}Card`;
    const card = document.getElementById(cardId);
    if (!card) {
      console.warn(`Card not found for company: ${company} (ID: ${cardId})`);
      return;
    }

    const detailsContainer = card.querySelector(".provider-details");
    if (!detailsContainer) {
      console.warn(`Details container not found for company: ${company}`);
      return;
    }

    updateCardDiscounts(
      card,
      company,
      tariffType,
      power,
      directDebit,
      electronicInvoice,
      additionalServices,
      luzGas
    );
    updateCardDetails(detailsContainer, company, tariffType, power, luzGas);
  });
} 