<?php
header('Content-Type: application/json');

// Получаем email из запроса
$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? trim($data['email']) : '';

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректный email']);
    exit;
}

// Генерируем 6-значный код
$code = random_int(100000, 999999);

// Сохраняем код во временный файл (можно заменить на БД)
$codesFile = __DIR__ . '/reset_codes.json';
$codes = file_exists($codesFile) ? json_decode(file_get_contents($codesFile), true) : [];
$codes[$email] = [
    'code' => $code,
    'expires' => time() + 900 // 15 минут
];
file_put_contents($codesFile, json_encode($codes));

// Отправляем письмо
$subject = 'Восстановление пароля BookAndBooks';
$message = "Ваш код для восстановления пароля: $code\n\nЕсли вы не запрашивали восстановление, просто проигнорируйте это письмо.";
$headers = 'From: no-reply@bookandbooks.local';

// Для теста можно раскомментировать строку ниже и смотреть код в файле
// file_put_contents(__DIR__.'/last_mail.txt', $message);

if (mail($email, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось отправить письмо']);
} 