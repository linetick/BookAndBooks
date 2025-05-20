<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../lib/db.php';
session_start();

// Проверка авторизации
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Неавторизован']);
    exit;
}

// Проверка метода
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit;
}

// Проверка наличия обязательных данных
if (empty($_POST['title'])) {
    http_response_code(422);
    echo json_encode(['error' => 'Поле title обязательно']);
    exit;
}

$title = trim($_POST['title']);
$description = trim($_POST['description'] ?? '');
$coverPath = null;

// Загрузка файла
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

    $coverPath = $relativePath;
}

// Сохранение книги в базу
try {
    $db = getDbConnection();
    $stmt = $db->prepare('
        INSERT INTO books (user_id, title, description, cover_path) 
        VALUES (?, ?, ?, ?)
    ');
    $stmt->execute([$_SESSION['user_id'], $title, $description, $coverPath]);

    http_response_code(201);
    echo json_encode(['message' => 'Книга создана']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
    error_log('DB error: ' . $e->getMessage());
}
