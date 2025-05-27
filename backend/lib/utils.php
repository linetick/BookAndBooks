<?php

require __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';

function rate_limit(string $key, int $maxAttempts, int $periodSeconds): void {
    $storageDir = sys_get_temp_dir() . '/rate_limit';
    if (!file_exists($storageDir)) {
        mkdir($storageDir, 0777, true);
    }

    $filePath = $storageDir . '/' . md5($key) . '.json';

    $attempts = [];
    if (file_exists($filePath)) {
        $attempts = json_decode(file_get_contents($filePath), true) ?? [];
    }

    $now = time();
    $attempts = array_filter($attempts, fn($timestamp) => $timestamp > $now - $periodSeconds);
    if (count($attempts) >= $maxAttempts) {
        http_response_code(429);
        echo json_encode(['error' => 'Слишком много запросов. Попробуйте позже.']);
        exit;
    }

    $attempts[] = $now;
    file_put_contents($filePath, json_encode($attempts));
}

function log_login_attempt($login_or_email, $success) {
    $db = getDbConnection();
    $stmt = $db->prepare("INSERT INTO login_attempts (login_or_email, success, attempt_time) VALUES (?, ?, NOW())");
    $stmt->execute([$login_or_email, $success ? 1 : 0]);
}

function send_activation_email($toEmail, $activationToken) {
    error_log("Вызов send_activation_email для {$toEmail} с токеном {$activationToken}");

    $mail = new PHPMailer(true);

    try {
        $mail->SMTPDebug = 2;
        $mail->Debugoutput = function($str, $level) {
            error_log("SMTP Debug: $str");
        };

        $mail->isSMTP();
        $mail->Host = 'smtp.yandex.ru';
        $mail->SMTPAuth = true;
        $mail->Username = 'mikhailova121327@yandex.ru';
        $mail->Password = 'fyflzdeuesdryssr'; // пароль приложения
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom('mikhailova121327@yandex.ru', 'BookNbook');
        $mail->addReplyTo('mikhailova121327@yandex.ru', 'BookNbook');
        $mail->addAddress($toEmail);

        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail->isHTML(false); // Отправка в виде простого текста

        $mail->Subject = 'Активация аккаунта';
        $activationLink = "http://localhost/api/activate.php?token=" . $activationToken;
        $mail->Body = "Для активации аккаунта перейдите по ссылке:\n\n" . $activationLink;
        $mail->AltBody = "Для активации аккаунта перейдите по ссылке:\n\n" . $activationLink;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mail error: " . $mail->ErrorInfo);
        return false;
    }
}

function addWatermark($imagePath)
{
    error_log("Добавляем водяной знак для $imagePath");

    $watermarkText = "BookAndBooks";
    $fontSize = 12;
    $fontFile = __DIR__ . '/arial.ttf';
    $textColorRGB = [255, 255, 255];

    if (!file_exists($fontFile)) {
        error_log("Файл шрифта не найден: $fontFile");
        throw new Exception("Файл шрифта не найден");
    }

    $ext = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'png'])) {
        error_log("Неподдерживаемый формат: $ext");
        throw new Exception("Неподдерживаемый формат изображения");
    }

    $image = ($ext === 'png')
        ? imagecreatefrompng($imagePath)
        : imagecreatefromjpeg($imagePath);

    if (!$image) {
        error_log("Не удалось загрузить изображение: $imagePath");
        throw new Exception("Не удалось загрузить изображение");
    }

    $width = imagesx($image);
    $height = imagesy($image);

    $textColor = imagecolorallocate($image, ...$textColorRGB);

    $margin = 10;
    $bbox = imagettfbbox($fontSize, 0, $fontFile, $watermarkText);
    $textWidth = $bbox[2] - $bbox[0];
    $textHeight = $bbox[1] - $bbox[7];

    $x = $width - $textWidth - $margin;
    $y = $height - $margin;

    imagettftext($image, $fontSize, 0, $x, $y, $textColor, $fontFile, $watermarkText);

    if ($ext === 'png') {
        imagepng($image, $imagePath);
    } else {
        imagejpeg($image, $imagePath, 90);
    }

    imagedestroy($image);
    error_log("Водяной знак успешно добавлен для $imagePath");
}


