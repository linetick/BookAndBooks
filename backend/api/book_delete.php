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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешён']);
    exit;
}

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Не авторизован']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$bookId = $data['id'] ?? null;

if (!$bookId || !is_numeric($bookId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректный ID книги']);
    exit;
}

$db = getDbConnection();
$db->beginTransaction();

try {
    $stmt = $db->prepare("DELETE FROM pages WHERE book_id = ?");
    $stmt->execute([$bookId]);

    $stmt = $db->prepare("DELETE FROM books WHERE id = ?");
    $stmt->execute([$bookId]);

    $db->commit();

    http_response_code(200);
    echo json_encode(['message' => 'Книга и страницы удалены']);
} catch (PDOException $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при удалении книги']);
    error_log("Ошибка при удалении книги: " . $e->getMessage());
}
