export function createHeader() {
  return `
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img
              src="images/logo-200x32.png"
              alt="Scriptai Logo"
              class="h-8"
            />
          </div>
          <nav class="flex space-x-4 md:space-x-8">
            <a href="https://www.scriptai.pt/index.html#inicio" class="text-gray-600 hover:text-gray-900 text-sm md:text-base">Início</a>
          </nav>
        </div>
      </div>
    </header>
  `;
}
