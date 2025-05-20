<?php
header('Content-Type: application/json');
require_once __DIR__.'/../lib/db.php';

try {
    $db = getDbConnection();
    $stmt = $db->query("SELECT 
        b.id AS book_id,
        b.title,
        b.description,
        b.cover_path,
        b.created_at,
        u.login AS author,
        p.page_number,
        p.content AS page_content
    FROM books b
    JOIN users u ON b.user_id = u.id
    LEFT JOIN pages p ON b.id = p.book_id
    ORDER BY b.id, p.page_number");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Группировка книг с вложенными страницами
    $books = [];
    foreach ($rows as $row) {
        $id = $row['book_id'];
        if (!isset($books[$id])) {
            $books[$id] = [
                'id' => $id,
                'title' => $row['title'],
                'description' => $row['description'],
                'cover_path' => $row['cover_path'],
                'created_at' => $row['created_at'],
                'author' => $row['author'],
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
    error_log("Books fetch error: " . $e->getMessage());
}
