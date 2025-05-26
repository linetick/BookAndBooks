<?php
require __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->SMTPDebug = 2; // включаем дебаг
    $mail->Debugoutput = 'echo';

    $mail->isSMTP();
    $mail->Host = 'smtp.yandex.ru';
    $mail->SMTPAuth = true;
    $mail->Username = 'mikhailova121327@yandex.ru';
    $mail->Password = 'fyflzdeuesdryssr'; // пароль приложения
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom('mikhailova121327@yandex.ru', 'Your Name');
    $mail->addAddress('linetick@mail.ru');

    $mail->Subject = 'Тема письма';
    $mail->Body    = 'Текст письма';

    $mail->send();
    echo "Письмо отправлено\n";
} catch (Exception $e) {
    echo "Ошибка отправки: {$mail->ErrorInfo}\n";
}
