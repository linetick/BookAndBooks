<?php
header('Content-Type: application/json');
require_once __DIR__.'/../lib/db.php';
require_once __DIR__.'/../lib/utils.php';

// 1. Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST method is allowed']);
    exit;
}

// 2. Ограничение частоты запросов
rate_limit('registration-'.$_SERVER['REMOTE_ADDR'], 50, 3600); // Макс 3 попытки в час

$data = json_decode(file_get_contents('php://input'), true);

// 3. Улучшенная валидация
$errors = [];
$login = trim($data['login'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($login) || !preg_match('/^[a-zA-Z0-9_]{4,20}$/', $login)) {
    $errors['login'] = 'Логин должен быть 4-20 символов (латиница, цифры, подчёркивание)';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Некорректный email';
}

if (empty($password) || strlen($password) < 8) {
    $errors['password'] = 'Пароль должен быть не менее 8 символов';
} elseif (!preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
    $errors['password'] = 'Пароль должен содержать цифры и заглавные буквы';
}

if (!empty($errors)) {
    http_response_code(422); // Unprocessable Entity
    echo json_encode(['errors' => $errors]);
    exit;
}

// 4. Проверка существования пользователя в транзакции
$db = getDbConnection();
$db->beginTransaction();

try {
    $stmt = $db->prepare("SELECT id FROM users WHERE login = ? OR email = ? FOR UPDATE");
    $stmt->execute([$login, $email]);
    
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Пользователь с таким логином или email уже существует']);
        $db->rollBack();
        exit;
    }

    // 5. Создание пользователя с дополнительными полями
    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    //$activationToken = bin2hex(random_bytes(32));
    $stmt = $db->prepare(
        "INSERT INTO users (login, email, password_hash, created_at) 
         VALUES (?, ?, ?, NOW())"
    );
    $stmt->execute([$login, $email, $passwordHash]);
    
    // 6. Отправка email для активации
    //send_activation_email($email, $activationToken);
    
    $db->commit();
    
    http_response_code(201);
    echo json_encode([
        'message' => 'Регистрация успешна. Проверьте email для активации',
        'user_id' => $db->lastInsertId()
    ]);
    
} catch (PDOException $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера при регистрации']);
    error_log("Registration error: ".$e->getMessage());
}