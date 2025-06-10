export function createHeader() {
  return `
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img
              src="https://scriptai.pt/wp-content/uploads/2023/12/scriptai-logo.png"
              alt="Scriptai Logo"
              class="h-8"
            />
          </div>
          <nav class="flex space-x-4 md:space-x-8">
            <a href="#" class="text-gray-600 hover:text-gray-900 text-sm md:text-base">Início</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 text-sm md:text-base">Sobre</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 text-sm md:text-base">Contato</a>
          </nav>
        </div>
      </div>
    </header>
  `;
} 