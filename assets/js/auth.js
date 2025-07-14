async function fazerLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('mensagemErro');

    try {
        const response = await fetch('validar_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (data.ok) {
            localStorage.setItem('autenticado', 'sim');
            localStorage.setItem('email', email);
            window.location.href = 'simulador.html';
        } else {
            mensagemErro.textContent = data.erro || 'Credenciais inválidas';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        mensagemErro.textContent = 'Erro ao tentar fazer login';
    }
}

function protegerSimulador() {
    const autenticado = localStorage.getItem('autenticado');
    if (autenticado !== 'sim') {
        window.location.href = 'login.html';
    }
}

function fazerLogout() {
    localStorage.removeItem('autenticado');
    localStorage.removeItem('email');
    window.location.href = 'login.html';
}
