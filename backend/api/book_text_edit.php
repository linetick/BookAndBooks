<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start([
    'cookie_httponly' => true,
    'cookie_secure' => false, // В dev-среде можно false
    'cookie_samesite' => 'Lax'
]);

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Неавторизован']);
    exit;
}

require_once __DIR__ . '/../lib/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$bookId = $data['id'] ?? null;
$pages = $data['pages'] ?? [];

if (!$bookId || !is_array($pages)) {
    http_response_code(422);
    echo json_encode(['error' => 'Неверный формат данных']);
    exit;
}

try {
    $db = getDbConnection();

    // Проверяем, принадлежит ли книга текущему пользователю
    $stmt = $db->prepare("SELECT id FROM books WHERE id = ? AND user_id = ?");
    $stmt->execute([$bookId, $_SESSION['user_id']]);
    $book = $stmt->fetch();

    if (!$book) {
        http_response_code(403);
        echo json_encode(['error' => 'Нет доступа к книге или она не найдена']);
        exit;
    }

    $db->beginTransaction();

    $stmt = $db->prepare("
        INSERT INTO pages (book_id, page_number, content)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE content = VALUES(content)
    ");

    foreach ($pages as $page) {
        $pageNumber = $page['page'] ?? null;
        $content = $page['content'] ?? '';
        if (!$pageNumber) continue;
        $stmt->execute([$bookId, $pageNumber, $content]);
    }

    $db->commit();

    http_response_code(200);
    echo json_encode(['message' => 'Страницы сохранены']);
} catch (PDOException $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
    error_log('book_text_edit error: ' . $e->getMessage());
}
