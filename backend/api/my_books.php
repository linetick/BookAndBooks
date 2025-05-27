<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
session_start();
require_once __DIR__.'/../lib/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Не авторизован']);
    exit;
}

try {
    $db = getDbConnection();
    $stmt = $db->prepare("
    SELECT 
        b.id AS book_id,
        b.title,
        b.description,
        b.cover_path,
        b.created_at,
        p.page_number,
        p.content AS page_content,
        u.login AS author  -- добавляем login автора
    FROM books b
    LEFT JOIN pages p ON b.id = p.book_id
    INNER JOIN users u ON b.user_id = u.id  -- связываем с пользователями
    WHERE b.user_id = ?
    ORDER BY b.id, p.page_number
");

    $stmt->execute([$_SESSION['user_id']]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $books = [];
    foreach ($rows as $row) {
        $id = $row['book_id'];
        if (!isset($books[$id])) {
            $books[$id] = [
        'id' => $id,
        'title' => $row['title'],
        'author' => $row['author'],  // добавляем автора сюда
        'description' => $row['description'],
        'cover_path' => $row['cover_path'],
        'created_at' => $row['created_at'],
        'pages' => []
        ];
        }

        if ($row['page_number'] !== null) {
            $books[$id]['pages'][] = [
                'page_number' => $row['page_number'],
                'content' => $row['page_content']
            ];
        }
    }

    echo json_encode(array_values($books), JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
    error_log("MyBooks fetch error: " . $e->getMessage());
}
