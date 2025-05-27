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
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Введите корректный email']);
    exit;
}

$db = getDbConnection();
$stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'Пользователь с таким email не найден']);
    exit;
}

$resetCode = random_int(100000, 999999);
$expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));

$stmt = $db->prepare("UPDATE users SET reset_code = ?, reset_expires_at = ? WHERE email = ?");
$stmt->execute([$resetCode, $expiresAt, $email]);

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.yandex.ru';
    $mail->SMTPAuth = true;
    $mail->Username = 'mikhailova121327@yandex.ru';
    $mail->Password = 'fyflzdeuesdryssr';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom('mikhailova121327@yandex.ru', 'BookNBook Support');
    $mail->addReplyTo('mikhailova121327@yandex.ru', 'BookNBook Support');
    $mail->addAddress($email);

    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->Subject = 'Восстановление пароля';
    $mail->Body = "Ваш код для восстановления пароля: $resetCode\n\nОн действует 15 минут.";
    $mail->AltBody = "Ваш код для восстановления пароля: $resetCode\n\nОн действует 15 минут.";

    $mail->send();
    echo json_encode(['message' => 'Код отправлен на email']);
} catch (Exception $e) {
    error_log("Email error: " . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось отправить письмо']);
}
