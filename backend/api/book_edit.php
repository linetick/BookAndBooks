<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../lib/db.php';

session_start([
    'cookie_httponly' => true,
    'cookie_secure' => false, // в dev-среде без HTTPS
    'cookie_samesite' => 'Lax'
]);

// 🔐 Проверка авторизации
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Неавторизован']);
    exit;
}

// 🔄 Проверка метода
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit;
}

// 📥 Проверка входных данных
$bookId = $_POST['id'] ?? null;
$title = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');

if (!$bookId || !is_numeric($bookId)) {
    http_response_code(422);
    echo json_encode(['error' => 'Некорректный ID книги']);
    exit;
}

if (empty($title)) {
    http_response_code(422);
    echo json_encode(['error' => 'Поле title обязательно']);
    exit;
}

$coverPath = null;
$uploadNewCover = false;

// 📁 Обработка файла (если есть)
if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filename = uniqid('cover_') . '.' . pathinfo($_FILES['cover']['name'], PATHINFO_EXTENSION);
    $fullPath = $uploadDir . $filename;
    $relativePath = '/uploads/' . $filename;

    if (!move_uploaded_file($_FILES['cover']['tmp_name'], $fullPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Не удалось сохранить файл']);
        exit;
    }

    try {
    addWatermark($fullPath);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при добавлении водяного знака', 'details' => $e->getMessage()]);
    error_log("Ошибка водяного знака: " . $e->getMessage());
    exit;
}

    $coverPath = $relativePath;
    $uploadNewCover = true;
}

// 🗃 Обновление книги
try {
    $db = getDbConnection();

    // Проверка, что книга принадлежит пользователю
    $stmt = $db->prepare("SELECT * FROM books WHERE id = ? AND user_id = ?");
    $stmt->execute([$bookId, $_SESSION['user_id']]);
    $book = $stmt->fetch();

    if (!$book) {
        http_response_code(403);
        echo json_encode(['error' => 'Нет доступа к книге или она не найдена']);
        exit;
    }

    if ($uploadNewCover) {
        $stmt = $db->prepare("
            UPDATE books 
            SET title = ?, description = ?, cover_path = ?
            WHERE id = ?
        ");
        $stmt->execute([$title, $description, $coverPath, $bookId]);
    } else {
        $stmt = $db->prepare("
            UPDATE books 
            SET title = ?, description = ?, updated_at = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$title, $description, $bookId]);
    }

    http_response_code(200);
    echo json_encode(['message' => 'Книга успешно обновлена']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
    error_log('DB error (book_edit): ' . $e->getMessage());
}
