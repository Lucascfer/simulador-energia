// Utility Functions
export function getNumericValue(elementId, defaultValue = 0) {
  const element = document.getElementById(elementId);
  if (!element) return defaultValue;
  const value = parseFloat(element.value);
  return isNaN(value) ? defaultValue : value;
}

export const formatNumericValue = (value, defaultValue = 0) => {
  const numValue = parseFloat(value);
  return isNaN(numValue) ? defaultValue : numValue;
};

export function createDetailElement(label, value, unit, isDiscounted = false) {
  const detail = document.createElement("div");
  detail.className = "detail-item";
  const numericValue = parseFloat(value) || 0;
  detail.innerHTML = `
    <span class="detail-label">${label}</span>
    <span class="detail-value ${
      isDiscounted ? "text-discounted" : ""
    }">${numericValue.toFixed(4)} ${unit}</span>
  `;
  return detail;
} 