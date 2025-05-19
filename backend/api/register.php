<?php
header('Content-Type: application/json');
require_once __DIR__.'/../../lib/db.php';
require_once __DIR__.'/../../lib/utils.php';

$data = json_decode(file_get_contents('php://input'), true);

// Валидация
$errors = [];
if (empty($data['login'])) $errors['login'] = 'Логин обязателен';
if (empty($data['email'])) $errors['email'] = 'Email обязателен';
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Некорректный email';
if (empty($data['password'])) $errors['password'] = 'Пароль обязателен';
if (strlen($data['password']) < 6) $errors['password'] = 'Пароль слишком короткий';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit;
}

// Проверка существования пользователя
$db = getDbConnection();
$stmt = $db->prepare("SELECT id FROM users WHERE login = ? OR email = ?");
$stmt->execute([$data['login'], $data['email']]);

if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Пользователь с таким логином или email уже существует']);
    exit;
}

// Создание пользователя
$passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
$stmt = $db->prepare("INSERT INTO users (login, email, password_hash) VALUES (?, ?, ?)");
$stmt->execute([$data['login'], $data['email'], $passwordHash]);

http_response_code(201);
echo json_encode(['message' => 'Регистрация успешна']);