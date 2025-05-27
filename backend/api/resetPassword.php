<?php
require_once __DIR__ . '/../lib/db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$code = trim($data['code'] ?? '');
$newPassword = $data['password'] ?? '';

if (empty($email) || empty($code) || empty($newPassword)) {
    http_response_code(422);
    echo json_encode(['error' => 'Все поля обязательны']);
    exit;
}

// Доп. проверка безопасности
// if (strlen($newPassword) < 8 || !preg_match('/[A-Z]/', $newPassword) || !preg_match('/[0-9]/', $newPassword)) {
//     http_response_code(422);
//     echo json_encode(['error' => 'Пароль должен быть не менее 8 символов, содержать цифры и заглавные буквы']);
//     exit;
// }

$db = getDbConnection();
$stmt = $db->prepare("SELECT reset_code, reset_expires_at FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || $user['reset_code'] !== $code || strtotime($user['reset_expires_at']) < time()) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный или просроченный код']);
    exit;
}

// Обновляем пароль и очищаем поля сброса
$newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
$stmt = $db->prepare("UPDATE users SET password_hash = ?, reset_code = NULL, reset_expires_at = NULL WHERE email = ?");
$stmt->execute([$newPasswordHash, $email]);

echo json_encode(['message' => 'Пароль успешно обновлён']);
