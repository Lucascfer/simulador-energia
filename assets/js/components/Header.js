export function createHeader() {
  return `
    <header style="background: linear-gradient(90deg, #130035 0%, #0f58d0 60%, #3e45ab 100%);" class="shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img
              src="images/LOGO-BRANCO.png"
              alt="Scriptai Logo"
              class="h-8"
            />
          </div>
          <nav class="flex space-x-4 md:space-x-8">
            <a href="https://www.scriptai.pt/index3.html#inicio" class="text-white hover:text-yellow-300 text-sm md:text-base font-semibold transition-colors duration-200">Início</a>
          </nav>
        </div>
      </div>
    </header>
  `;
}
