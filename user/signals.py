# accounts/signals.py

from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # send an e-mail to the user
    context = {
         'username': reset_password_token.user.username,
         'email': reset_password_token.user.email,
         'token': reset_password_token.key,
    } # these are the data i need to put inside the email message

    # render email message
    email_html_message = render_to_string('email/password_reset_email.html', context)
    email_plaintext_message = render_to_string('email/password_reset_email.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        "Password Reset for {title}".format(title="Torbati"),
        # message:
        email_plaintext_message,
        # from:
        "Torbati <noreply@torbati.com>",
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()