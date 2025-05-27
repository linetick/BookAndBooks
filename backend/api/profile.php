<?php
// profile.php

session_start(); // Для работы сессии

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000"); // замените на свой адрес фронта
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


// Проверка авторизации
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Пользователь не авторизован"]);
    exit;
}

$userId = $_SESSION['user_id'];

// Подключение к БД
$host = 'localhost';
$dbname = 'your_database';
$username = 'your_db_user';
$password = 'your_db_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Получение логина и email по user_id
    $stmt = $pdo->prepare("SELECT login, email FROM users WHERE id = :id");
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Пользователь не найден"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Ошибка базы данных: " . $e->getMessage()]);
}
