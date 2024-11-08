<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $comments = htmlspecialchars($_POST['comments']);
    
    // Set recipient email
    $to = "rayjebb@gmail.com";
    
    // Set email subject
    $subject = "Feedback from Space-Scale Website";
    
    // Build the email content
    $message = "You have received new feedback:\n\n";
    $message .= "Name: $name\n";
    $message .= "Email: $email\n";
    $message .= "Comments: $comments\n";
    
    // Set email headers
    $headers = "From: $email";
    
    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo "Thank you for your feedback!";
    } else {
        echo "There was an error sending your feedback. Please try again.";
    }
} else {
    echo "Invalid request.";
}
?>
