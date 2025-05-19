<?php
header('Content-Type: application/json');
require_once __DIR__.'/../../lib/db.php';
require_once __DIR__.'/../../lib/auth.php';

$data = json_decode(file_get_contents('php://input'), true);

// Валидация
if (empty($data['login']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Логин и пароль обязательны']);
    exit;
}

// Поиск пользователя
$db = getDbConnection();
$stmt = $db->prepare("SELECT * FROM users WHERE login = ? OR email = ?");
$stmt->execute([$data['login'], $data['login']]);
$user = $stmt->fetch();

if (!$user || !password_verify($data['password'], $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Неверный логин или пароль']);
    exit;
}

// Создание сессии
session_start();
$_SESSION['user_id'] = $user['id'];

echo json_encode([
    'message' => 'Авторизация успешна',
    'user' => [
        'id' => $user['id'],
        'login' => $user['login'],
        'email' => $user['email']
    ]
]);