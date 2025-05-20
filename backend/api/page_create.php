<?php
header('Content-Type: application/json');
require_once __DIR__.'/../lib/db.php';
require_once __DIR__.'/../lib/utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Только POST-запросы']);
    exit;
}

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Не авторизован']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$book_id = (int)($data['book_id'] ?? 0);
$page_number = (int)($data['page_number'] ?? 0);
$content = trim($data['content'] ?? '');

$errors = [];
if ($book_id <= 0) $errors['book_id'] = 'Неверный ID книги';
if ($page_number <= 0) $errors['page_number'] = 'Номер страницы должен быть положительным';
if (empty($content)) $errors['content'] = 'Контент страницы не может быть пустым';

if ($errors) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

try {
    $db = getDbConnection();

    // Проверка, что книга принадлежит пользователю
    $stmt = $db->prepare("SELECT id FROM books WHERE id = ? AND user_id = ?");
    $stmt->execute([$book_id, $_SESSION['user_id']]);
    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Нет доступа к этой книге']);
        exit;
    }

    // Добавление страницы
    $stmt = $db->prepare("INSERT INTO pages (book_id, page_number, content) VALUES (?, ?, ?)");
    $stmt->execute([$book_id, $page_number, $content]);

    http_response_code(201);
    echo json_encode(['message' => 'Страница добавлена']);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        http_response_code(409);
        echo json_encode(['error' => 'Страница с таким номером уже существует']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка сервера']);
        error_log('Page insert error: ' . $e->getMessage());
    }
}
