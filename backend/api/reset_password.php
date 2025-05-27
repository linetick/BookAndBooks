<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? trim($data['email']) : '';
$code = isset($data['code']) ? trim($data['code']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if (!$email || !$code || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Все поля обязательны']);
    exit;
}

// Проверяем код
$codesFile = __DIR__ . '/reset_codes.json';
$codes = file_exists($codesFile) ? json_decode(file_get_contents($codesFile), true) : [];
if (!isset($codes[$email]) || $codes[$email]['code'] != $code || $codes[$email]['expires'] < time()) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный или просроченный код']);
    exit;
}

// Здесь должна быть логика смены пароля в БД. Для примера — users.json
$usersFile = __DIR__ . '/users.json';
$users = file_exists($usersFile) ? json_decode(file_get_contents($usersFile), true) : [];
$found = false;
foreach ($users as &$user) {
    if (isset($user['email']) && strtolower($user['email']) === strtolower($email)) {
        $user['password'] = password_hash($password, PASSWORD_DEFAULT);
        $found = true;
        break;
    }
}
if (!$found) {
    http_response_code(404);
    echo json_encode(['error' => 'Пользователь не найден']);
    exit;
}
file_put_contents($usersFile, json_encode($users));
// Удаляем использованный код
unset($codes[$email]);
file_put_contents($codesFile, json_encode($codes));
echo json_encode(['success' => true]); 