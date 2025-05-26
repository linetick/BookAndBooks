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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Только POST-запросы']);
    exit;
}

// Брутфорс-защита
//rate_limit('login-attempt-' . $_SERVER['REMOTE_ADDR'], 5, 60);

$data = json_decode(file_get_contents('php://input'), true);

// 🔧 Исправлено: логин берём из loginInput, как в React
$login = trim($data['loginInput'] ?? '');
$password = $data['password'] ?? '';

// Валидация
$errors = [];


if (!empty($errors)) {
    http_response_code(422);
    header('Content-Type: application/json');
    echo json_encode(['errors' => $errors]);
    exit;
}

$db = getDbConnection();
$db->beginTransaction();

try {
    $stmt = $db->prepare("SELECT * FROM users WHERE login = ? OR email = ? FOR UPDATE");
    $stmt->execute([$login, $login]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Неверный логин или пароль']);
        $db->rollBack();
        exit;
    }

    if (!$user['is_active']) {
        http_response_code(403);
        echo json_encode(['error' => 'Аккаунт не активирован']);
        $db->rollBack();
        exit;
    }

    $db->prepare("UPDATE users SET updated_at = NOW() WHERE id = ?")->execute([$user['id']]);

    session_start([
        'cookie_httponly' => true,
        'cookie_secure' => true,
        'cookie_samesite' => 'Strict'
    ]);

    session_regenerate_id(true);

    $_SESSION = [
        'user_id' => $user['id'],
        'ip' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT']
    ];

    $db->commit();

    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    http_response_code(200);
    echo json_encode([
        'message' => 'Авторизация успешна',
        'user' => [
            'id' => $user['id'],
            'login' => $user['login'],
            'email' => $user['email']
        ],
        'csrf_token' => $_SESSION['csrf_token']
    ]);

} catch (PDOException $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
    error_log("Login error: " . $e->getMessage());
}
