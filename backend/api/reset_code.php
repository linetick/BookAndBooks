<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../lib/db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$code = trim($data['code'] ?? '');

if (empty($email) || empty($code)) {
    http_response_code(422);
    echo json_encode(['error' => 'Email и код обязательны']);
    exit;
}

$db = getDbConnection();
$stmt = $db->prepare("SELECT reset_code, reset_expires_at FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || $user['reset_code'] !== $code) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный код']);
    exit;
}

if (strtotime($user['reset_expires_at']) < time()) {
    http_response_code(410); // Gone
    echo json_encode(['error' => 'Код истёк']);
    exit;
}

// Код верный
echo json_encode(['message' => 'Код подтверждён']);
