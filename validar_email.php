<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'erro' => 'Método não permitido']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

if (!isset($dados['email']) || !isset($dados['senha'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'erro' => 'Dados incompletos']);
    exit;
}

$email = $dados['email'];
$senha = $dados['senha'];

// Configuração IMAP
$host = '{mail.scriptai.pt:993/imap/ssl}INBOX';
$mailbox = imap_open($host, $email, $senha);

if ($mailbox) {
    imap_close($mailbox);
    echo json_encode(['ok' => true]);
} else {
    $error = imap_last_error();
    echo json_encode([
        'ok' => false, 
        'erro' => 'Credenciais inválidas', 
        'debug' => $error
    ]);
}
