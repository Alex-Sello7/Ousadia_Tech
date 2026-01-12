<?php
// send-email.php
// Ousadia Tech Solutions Contact Form Handler

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 in production

// Set content type to JSON
header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Get form data
$name = htmlspecialchars(trim($_POST['name'] ?? ''));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
$subject = htmlspecialchars(trim($_POST['subject'] ?? ''));
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

// Additional security: Validate input length
$errors = [];

if (strlen($name) > 100) {
    $errors[] = 'Name is too long (maximum 100 characters)';
}

if (strlen($email) > 100) {
    $errors[] = 'Email is too long';
}

if (strlen($subject) > 200) {
    $errors[] = 'Subject is too long (maximum 200 characters)';
}

if (strlen($message) > 2000) {
    $errors[] = 'Message is too long (maximum 2000 characters)';
}

// Validation
if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($subject)) {
    $errors[] = 'Subject is required';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

// If there are errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please fix the following errors:',
        'errors' => $errors
    ]);
    exit;
}

// Email configuration
$to = "info@ousadiaconsulting.com"; 
$company_name = "Ousadia Tech Solutions";
$company_email = "info@ousadiaconsulting.com"; 
$company_phone = "+27 69 535 2793";
$website_url = "https://ousadiats.co.za";
$domain = "ousadiats.co.za";

// Email subject
$email_subject = "New Contact Form Submission: $subject";

// Email body to company
$email_body = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header { 
            background-color: #EB770A; 
            color: white; 
            padding: 25px 20px; 
            text-align: center; 
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
        }
        .content { 
            padding: 30px; 
        }
        .field { 
            margin-bottom: 20px; 
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        .field:last-child {
            border-bottom: none;
        }
        .field-label { 
            font-weight: bold; 
            color: #EB770A;
            display: block;
            margin-bottom: 5px;
            font-size: 16px;
        }
        .field-value {
            color: #555;
            font-size: 15px;
        }
        .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
            font-size: 13px; 
            color: #666;
            text-align: center;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .message-content {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #EB770A;
            margin-top: 10px;
            white-space: pre-line;
        }
        .urgent {
            background-color: #fff0f0;
            border: 1px solid #ffcccc;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>&#128231; New Contact Form Submission</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="field-label">&#128100; From:</span>
                <span class="field-value">' . $name . '</span>
            </div>
            <div class="field">
                <span class="field-label">&#128231; Email:</span>
                <span class="field-value">' . $email . '</span>
            </div>
            <div class="field">
                <span class="field-label">&#128241; Phone:</span>
                <span class="field-value">' . ($phone ?: '<em>Not provided</em>') . '</span>
            </div>
            <div class="field">
                <span class="field-label">&#128203; Subject:</span>
                <span class="field-value">' . $subject . '</span>
            </div>
            <div class="field">
                <span class="field-label">&#128172; Message:</span>
                <div class="message-content">' . nl2br($message) . '</div>
            </div>
            
            <div class="urgent">
                <strong>&#9888;&#65039; URGENT - ACTION REQUIRED:</strong> Please respond to this inquiry within 24 hours.
                <br><br>
                <strong>Quick Actions:</strong>
                <br>1. &#128231; <strong>Reply to:</strong> <a href="mailto:' . $email . '?subject=Re: ' . rawurlencode($subject) . '">' . $email . '</a>
                <br>2. &#128241; <strong>Call:</strong> ' . ($phone ?: 'Phone not provided') . '
            </div>
        </div>
        <div class="footer">
            <p>This email was automatically sent from the contact form on ' . $company_name . ' website.</p>
            <p>&#128197; Received on: ' . date('F j, Y \a\t g:i a') . ' (SAST)</p>
            <p>&#127760; Website: <a href="' . $website_url . '">' . $website_url . '</a></p>
            <p>&#128681; IP Address: ' . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . '</p>
        </div>
    </div>
</body>
</html>';

// Email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: " . $company_name . " Website <no-reply@" . $domain . ">\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "X-Priority: 1 (Highest)\r\n";
$headers .= "Importance: High\r\n";
$headers .= "X-Auto-Response-Suppress: All\r\n";

// Try to send email to company
try {
    $mail_sent = mail($to, $email_subject, $email_body, $headers);
    
    if ($mail_sent) {
        // Send auto-reply to user
        $auto_reply_subject = "Thank you for contacting " . $company_name;
        $auto_reply_body = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for contacting us</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .header { 
                    background-color: #EB770A; 
                    color: white; 
                    padding: 25px 20px; 
                    text-align: center; 
                }
                .header h2 {
                    margin: 0;
                    font-size: 24px;
                }
                .content { 
                    padding: 30px; 
                }
                .signature { 
                    margin-top: 30px; 
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }
                .summary {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #EB770A;
                }
                .contact-info {
                    background-color: #fff8f0;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .contact-info h4 {
                    color: #EB770A;
                    margin-top: 0;
                }
                .icon {
                    color: #EB770A;
                    margin-right: 10px;
                }
                .footer {
                    background-color: #f9f9f9;
                    padding: 20px;
                    text-align: center;
                    font-size: 13px;
                    color: #666;
                }
                .response-time {
                    background-color: #e8f4ff;
                    padding: 10px;
                    border-radius: 5px;
                    margin: 15px 0;
                    border-left: 4px solid #4a90e2;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Thank You for Contacting ' . $company_name . '!</h2>
                </div>
                <div class="content">
                    <p>Dear <strong>' . $name . '</strong>,</p>
                    
                    <p>Thank you for reaching out to <strong>' . $company_name . '</strong>. We have received your inquiry and our team is already reviewing it.</p>
                    
                    <div class="response-time">
                        <strong>&#9200; Our Response Time:</strong>
                        <p>We typically respond to inquiries within <strong>24-48 hours</strong> during business days:</p>
                        <p>&bull; Monday to Friday: 8:00 AM - 5:00 PM SAST</p>
                        <p>&bull; Weekends &amp; Public Holidays: Next business day</p>
                    </div>
                    
                    <div class="summary">
                        <h4>&#128203; Your Inquiry Summary:</h4>
                        <p><strong>Reference:</strong> #OTS-' . date('Ymd') . '-' . rand(1000, 9999) . '</p>
                        <p><strong>Subject:</strong> ' . $subject . '</p>
                        <p><strong>Message:</strong></p>
                        <div style="background-color: white; padding: 10px; border-radius: 3px; margin-top: 5px;">
                            ' . nl2br($message) . '
                        </div>
                    </div>
                    
                    <div class="contact-info">
                        <h4>&#128222; Our Contact Information:</h4>
                        <p><span class="icon">&#128205;</span> <strong>Address:</strong> 1st Floor, Gateway West, 22 Magwa Cres, Waterfall, Midrand, 2066, South Africa</p>
                        <p><span class="icon">&#128231;</span> <strong>Email:</strong> <a href="mailto:' . $company_email . '">' . $company_email . '</a></p>
                        <p><span class="icon">&#128241;</span> <strong>Phone:</strong> <a href="tel:' . str_replace(' ', '', $company_phone) . '">' . $company_phone . '</a></p>
                        <p><span class="icon">&#127760;</span> <strong>Website:</strong> <a href="' . $website_url . '">' . $website_url . '</a></p>
                    </div>
                    
                    <p><strong>Need immediate assistance?</strong> If your inquiry is urgent, please call us directly at ' . $company_phone . '.</p>
                    
                    <div class="signature">
                        <p>Best regards,</p>
                        <p><strong>' . $company_name . ' Team</strong></p>
                        <p><em>"Empowering Africa Through Digital Transformation"</em></p>
                    </div>
                </div>
                <div class="footer">
                    <p>This is an automated confirmation email. Please do not reply to this message.</p>
                    <p>If you need to update your inquiry, please contact us at <a href="mailto:' . $company_email . '">' . $company_email . '</a></p>
                    <p>&copy; ' . date('Y') . ' ' . $company_name . '. All rights reserved. | Registration Number: 2022/123456/07</p>
                </div>
            </div>
        </body>
        </html>';

        $auto_reply_headers = "MIME-Version: 1.0\r\n";
        $auto_reply_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $auto_reply_headers .= "From: " . $company_name . " <" . $company_email . ">\r\n";
        $auto_reply_headers .= "Reply-To: " . $company_name . " <" . $company_email . ">\r\n";
        
        // Send auto-reply to user
        $auto_reply_sent = mail($email, $auto_reply_subject, $auto_reply_body, $auto_reply_headers);
        
        // Save to log file for record keeping
        $log_entry = "[" . date('Y-m-d H:i:s') . "] CONTACT_FORM - Name: " . substr($name, 0, 50) . " | Email: $email | Phone: " . ($phone ?: 'Not provided') . " | Subject: " . substr($subject, 0, 100) . " | IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . " | User Agent: " . substr(($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'), 0, 200) . "\n";
        @file_put_contents('contact_submissions.log', $log_entry, FILE_APPEND | LOCK_EX);
        
        // Also save to CSV for easy import
        $csv_entry = '"' . date('Y-m-d H:i:s') . '","' . str_replace('"', '""', $name) . '","' . $email . '","' . str_replace('"', '""', $phone) . '","' . str_replace('"', '""', $subject) . '","' . str_replace('"', '""', $message) . '"' . "\n";
        
        // Create CSV file if it doesn't exist (with headers)
        $csv_file = 'contact_submissions.csv';
        if (!file_exists($csv_file)) {
            $csv_headers = '"Timestamp","Name","Email","Phone","Subject","Message"' . "\n";
            @file_put_contents($csv_file, $csv_headers, LOCK_EX);
        }
        
        @file_put_contents($csv_file, $csv_entry, FILE_APPEND | LOCK_EX);
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. We will get back to you within 24-48 hours. You should receive a confirmation email shortly.'
        ]);
        
    } else {
        // Log the mail failure
        $error_log = "[" . date('Y-m-d H:i:s') . "] MAIL_FAILURE - Name: " . substr($name, 0, 50) . " | Email: $email | Error: mail() function returned false | Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "\n";
        @file_put_contents('mail_errors.log', $error_log, FILE_APPEND | LOCK_EX);
        
        // Try alternative method if primary fails
        $fallback_sent = @mail($to, $email_subject, strip_tags($email_body), 
            "From: " . $company_name . " <no-reply@" . $domain . ">\r\n" .
            "Reply-To: " . $email . "\r\n" .
            "Content-Type: text/plain; charset=UTF-8"
        );
        
        if ($fallback_sent) {
            echo json_encode([
                'success' => true,
                'message' => 'Thank you! Your message has been sent (plain text). We will get back to you within 24-48 hours.'
            ]);
        } else {
            throw new Exception('The mail server failed to send the message.');
        }
    }
    
} catch (Exception $e) {
    // Log the exception
    $exception_log = "[" . date('Y-m-d H:i:s') . "] EXCEPTION - Name: " . substr($name, 0, 50) . " | Email: $email | Error: " . $e->getMessage() . " | File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    @file_put_contents('contact_errors.log', $exception_log, FILE_APPEND | LOCK_EX);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly at ' . $company_email . ' or call us at ' . $company_phone
    ]);
    exit;
}
?>