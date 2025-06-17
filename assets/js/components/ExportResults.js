// Função para gerar o template de exportação
function generateExportTemplate(
  results,
  currentResult,
  calculationDays,
  energyDiscount,
  gasDiscount,
  energyConsumption,
  gasConsumption
) {
  const formatEnergyConsumption = (consumption) => {
    if (typeof consumption === "object") {
      if (consumption.simples) {
        return `${consumption.simples.amount} kWh (Simples)`;
      } else if (consumption.vazio && consumption.foraVazio) {
        return `${consumption.vazio.amount} kWh (Vazio), ${consumption.foraVazio.amount} kWh (Fora Vazio)`;
      } else if (consumption.ponta && consumption.cheia && consumption.vazio) {
        return `${consumption.ponta.amount} kWh (Ponta), ${consumption.cheia.amount} kWh (Cheia), ${consumption.vazio.amount} kWh (Vazio)`;
      }
    }
    return "N/A";
  };

  return `
    <div class="export-template" style="padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 30px; border-radius: 12px; background: linear-gradient(135deg, #3a3a3a, #1a1a1a); box-shadow: 0 8px 16px rgba(0,0,0,0.3); margin-bottom: 40px;">
        <img src="../assets/images/logo_gold.png" alt="Logo Script AI" style="max-width: 250px; margin-bottom: 18px; display: block; margin-left: auto; margin-right: auto;">
        <h1 style="color: #FFD700; font-size: 28px; margin-bottom: 10px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Relatório de Simulação de Economia</h1>
        <p style="color: #E0E0E0; font-size: 16px;">Gerado em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}</p>
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2B4C7E; font-size: 18px; margin-bottom: 10px;">Resumo da Simulação</h2>
        <p style="color: #666; margin-bottom: 5px;">Período de cálculo: ${calculationDays} dias</p>
        <p style="color: #666; margin-bottom: 5px;">Consumo de Energia: ${formatEnergyConsumption(
          energyConsumption
        )}</p>
        ${
          gasConsumption > 0
            ? `<p style="color: #666; margin-bottom: 5px;">Consumo de Gás: ${gasConsumption} kWh</p>`
            : ""
        }
        ${
          energyDiscount > 0
            ? `<p style="color: #666; margin-bottom: 5px;">Desconto em energia: ${energyDiscount}%</p>`
            : ""
        }
        ${
          gasDiscount > 0
            ? `<p style="color: #666; margin-bottom: 5px;">Desconto em gás: ${gasDiscount}%</p>`
            : ""
        }
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #2B4C7E; font-size: 18px; margin-bottom: 10px;">Situação Atual</h2>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Total Atual</span>
            <span style="font-weight: bold; color: #2B4C7E;">€${currentResult.total.toFixed(
              2
            )}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #666;">
            <span>Energia: €${currentResult.energyCost.toFixed(2)}</span>
            ${
              currentResult.gasCost > 0
                ? `<span>Gás: €${currentResult.gasCost.toFixed(2)}</span>`
                : ""
            }
          </div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #2B4C7E; font-size: 18px; margin-bottom: 10px;">Opções Disponíveis</h2>
        ${results
          .filter((result) => !result.isCurrent)
          .map((result, index, array) => {
            const savings = currentResult.total - result.total;
            const savingsPercentage = (
              (savings / currentResult.total) *
              100
            ).toFixed(1);
            const isSaving = savings > 0;
            const isLast = index === array.length - 1;

            return `
              <div style="background-color: ${
                index === 0 ? "#e8f5e9" : "white"
              }; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); ${
              isLast
                ? ""
                : "margin-bottom: 10px; border-bottom: 1px solid #e0e0e0;"
            }">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <div>
                    <span style="font-weight: bold;">${result.company}</span>
                    ${
                      index === 0
                        ? '<span style="background-color: #000000; color: #FFD700; padding: 0px 10px 10px 10px; border-radius: 15px; font-size: 13px; font-weight: 600; margin-left: 12px; display: inline-block;">Melhor Opção</span>'
                        : ""
                    }
                  </div>
                  <span style="font-weight: bold; color: #2B4C7E;">€${result.total.toFixed(
                    2
                  )}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #666; margin-bottom: 10px;">
                  <span>Energia: €${result.energyCost.toFixed(2)}</span>
                  ${
                    result.gasCost > 0
                      ? `<span>Gás: €${result.gasCost.toFixed(2)}</span>`
                      : ""
                  }
                </div>
                <div style="display: flex; justify-content: space-between; color: ${
                  isSaving ? "#4caf50" : "#f44336"
                };">
                  <span>${
                    isSaving ? "Economia" : "Custo adicional"
                  }: €${Math.abs(savings).toFixed(2)}</span>
                  <span>${isSaving ? "+" : "-"}${savingsPercentage}%</span>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 30px; font-size: 12px; color: #666;">
        <p style="margin-bottom: 5px;"><strong>Nota:</strong> Esta simulação utiliza preços de referência e pode não refletir os valores exatos da sua fatura.</p>
        ${
          energyDiscount > 0 || gasDiscount > 0
            ? `<p>Os descontos aplicados são estimativas e podem variar de acordo com as condições específicas de cada comercializadora.</p>`
            : ""
        }
      </div>
    </div>
  `;
}

// Função para extrair dados dos resultados
function extractResultsData() {
  const allResults = [];
  const resultsContainer = document.getElementById('resultsContainer');
  const mainContentDiv = resultsContainer?.firstElementChild; 
  
  // Extrair a comercializadora atual (Valores Atuais) que não tem checkbox
  const currentCard = resultsContainer?.querySelector('.result-card .font-bold') ? resultsContainer.querySelector('.result-card') : null;
  if (currentCard) {
    const companyElement = currentCard.querySelector('.font-bold');
    const totalElement = currentCard.querySelector('.text-lg');
    
    // Get the container for energy and gas info
    const energyGasContainer = currentCard.querySelector('.flex.justify-between.items-center.text-sm.text-gray-600');
    
    let energyCost = 0;
    let gasCost = 0;

    if (energyGasContainer) {
      const energyDiv = energyGasContainer.querySelector('div:first-child');
      const gasDiv = energyGasContainer.querySelector('div:nth-child(2)'); // This will be null if gas is not present

      if (energyDiv) {
        const energySpan = energyDiv.querySelector('span');
        energyCost = parseFloat(energySpan?.textContent.split('€')[1]?.trim() || '0');
      }

      if (gasDiv) { // Only try to get gas cost if the gasDiv exists
        const gasSpan = gasDiv.querySelector('span');
        gasCost = parseFloat(gasSpan?.textContent.split('€')[1]?.trim() || '0');
      }
    }
    

    if (companyElement && totalElement) { // Adjusted condition as energy/gas cost extracted differently
      const company = companyElement.textContent.trim();
      const total = parseFloat(totalElement.textContent.replace('€', '').trim());
      
      allResults.push({
        company,
        total,
        energyCost,
        gasCost,
        isCurrent: true
      });
    }
  }

  // Extrair dados das comercializadoras selecionadas via checkbox
  const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"][data-company]:checked');
  
  selectedCheckboxes.forEach(checkbox => {
    const companyName = checkbox.dataset.company;
    const card = checkbox.closest('.result-card');

    if (card && companyName) {
      const totalElement = card.querySelector('.text-lg');
      const energyGasContainer = card.querySelector('.flex.justify-between.items-center.text-sm.text-gray-600'); // Again, get the container

      let energyCost = 0;
      let gasCost = 0;

      if (energyGasContainer) {
        const energyDiv = energyGasContainer.querySelector('div:first-child');
        const gasDiv = energyGasContainer.querySelector('div:nth-child(2)');

        if (energyDiv) {
          const energySpan = energyDiv.querySelector('span');
          energyCost = parseFloat(energySpan?.textContent.split('€')[1]?.trim() || '0');
        }

        if (gasDiv) {
          const gasSpan = gasDiv.querySelector('span');
          gasCost = parseFloat(gasSpan?.textContent.split('€')[1]?.trim() || '0');
        }
      }

      if (totalElement) { // Adjusted condition
        const total = parseFloat(totalElement.textContent.replace('€', '').trim());

        allResults.push({
          company: companyName,
          total,
          energyCost,
          gasCost,
          isCurrent: false
        });
      }
    }
  });

  const currentResult = allResults.find(r => r.isCurrent);
  const results = allResults.filter(r => !r.isCurrent);

  const daysText = mainContentDiv?.querySelector('.text-gray-700')?.textContent || '';
  const calculationDays = daysText.match(/\d+/)?.[0] || '30';
  
  const discountElements = mainContentDiv?.querySelectorAll('.text-gray-700');
  let energyDiscount = 0;
  let gasDiscount = 0;
  
  discountElements?.forEach(element => {
    const text = element.textContent;
    if (text.includes('energia')) {
      energyDiscount = parseInt(text.match(/\d+/)?.[0] || '0');
    } else if (text.includes('gás')) {
      gasDiscount = parseInt(text.match(/\d+/)?.[0] || '0');
    }
  });

  const energyConsumptionData = mainContentDiv?.dataset.energyConsumption;
  const gasConsumptionData = mainContentDiv?.dataset.gasConsumption;

  let energyConsumption = {};
  if (energyConsumptionData) {
    try {
      energyConsumption = JSON.parse(energyConsumptionData);
    } catch (e) {
      console.error("Erro ao parsear energyConsumptionData:", e);
    }
  }
  
  const gasConsumption = gasConsumptionData ? parseFloat(gasConsumptionData) : 0;

  return {
    results,
    currentResult,
    calculationDays,
    energyDiscount,
    gasDiscount,
    energyConsumption,
    gasConsumption
  };
}

// Função para criar o container de exportação
function createExportContainer() {
  const exportContainer = document.createElement("div");
  exportContainer.style.position = "absolute";
  exportContainer.style.left = "-9999px";
  exportContainer.style.top = "-9999px";
  exportContainer.style.width = "800px";
  document.body.appendChild(exportContainer);
  return exportContainer;
}

// Função para gerar o canvas com os resultados
async function generateResultsCanvas() {
  const resultsContainer = document.getElementById("resultsContainer");
  if (!resultsContainer) {
    throw new Error("Container de resultados não encontrado");
  }

  const exportContainer = createExportContainer();
  const {
    results,
    currentResult,
    calculationDays,
    energyDiscount,
    gasDiscount,
    energyConsumption,
    gasConsumption,
  } = extractResultsData();

  if (!currentResult) {
    document.body.removeChild(exportContainer);
    throw new Error("Não foi possível encontrar os resultados atuais");
  }

  exportContainer.innerHTML = generateExportTemplate(
    results,
    currentResult,
    calculationDays,
    energyDiscount,
    gasDiscount,
    energyConsumption,
    gasConsumption
  );

  try {
    const canvas = await html2canvas(exportContainer, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff'
    });
    document.body.removeChild(exportContainer);
    return canvas;
  } catch (error) {
    document.body.removeChild(exportContainer);
    throw error;
  }
}

// Função para exportar como imagem
export async function exportAsImage() {
  try {
    const canvas = await generateResultsCanvas();
    const link = document.createElement("a");
    link.download = "resultados-simulador.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
  }
}

// Função para exportar como PDF
export async function exportAsPDF() {
  try {
    const canvas = await generateResultsCanvas();
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );
    pdf.save("resultados-simulador.pdf");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
}

// Função para configurar os botões de exportação
export function setupExportButtons() {
  const exportImageBtn = document.getElementById("exportImage");
  const exportPDFBtn = document.getElementById("exportPDF");

  if (exportImageBtn) {
    exportImageBtn.addEventListener("click", exportAsImage);
  }

  if (exportPDFBtn) {
    exportPDFBtn.addEventListener("click", exportAsPDF);
  }
}
