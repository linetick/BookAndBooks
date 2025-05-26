<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__.'/../lib/db.php';
require_once __DIR__.'/../lib/auth.php';
require_once __DIR__.'/../lib/utils.php';


// Добавить проверку метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Только POST-запросы']);
    exit;
}

// Ограничение частоты запросов (защита от брутфорса)
rate_limit('login-attempt-'.$_SERVER['REMOTE_ADDR'], 5, 60);

$data = json_decode(file_get_contents('php://input'), true);

// Более строгая валидация
$errors = [];
if (empty($data['login']) || !preg_match('/^[a-zA-Z0-9_]{3,20}$/', $data['login'])) {
    $errors['login'] = 'Логин должен быть 3-20 символов (латиница, цифры, _)';
}
if (empty($data['password']) || strlen($data['password']) < 8) {
    $errors['password'] = 'Пароль должен быть не менее 8 символов';
}

if (!empty($errors)) {
    http_response_code(422); // Unprocessable Entity
    header('Content-Type: application/json');
    echo json_encode(['errors' => $errors]);
    exit;
}

// Поиск пользователя с блокировкой для UPDATE (защита от timing-атак)
$db = getDbConnection();
$db->beginTransaction();

try {
    $stmt = $db->prepare("
        SELECT * FROM users 
        WHERE login = ? OR email = ? 
        FOR UPDATE
    ");
    $stmt->execute([$data['login'], $data['login']]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Неверный логин или пароль']);
        $db->rollBack();
        exit;
    }
    
    // Обновляем время последнего входа
    $db->prepare("UPDATE users SET updated_at = NOW() WHERE id = ?")
       ->execute([$user['id']]);
    
    // Создаем сессию
    session_start([
        'cookie_httponly' => true,
        'cookie_secure' => true,
        'cookie_samesite' => 'Strict'
    ]);
    
    // Регенерируем ID сессии
    session_regenerate_id(true);
    
    $_SESSION = [
        'user_id' => $user['id'],
        'ip' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT']
    ];
    
    $db->commit();
    
    // Генерация CSRF-токена
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $csrf_token;
    
    http_response_code(200);
    echo json_encode([
        'message' => 'Авторизация успешна',
        'user' => [
            'id' => $user['id'],
            'login' => $user['login'],
            'email' => $user['email']
        ],
        'csrf_token' => $csrf_token
    ]);
    
} catch (PDOException $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
    error_log("Login error: ".$e->getMessage());
}
