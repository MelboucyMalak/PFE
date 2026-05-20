from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # delete the old tokens
    from django_rest_passwordreset.models import ResetPasswordToken
    ResetPasswordToken.objects.filter(
        user=reset_password_token.user
    ).exclude(
        key=reset_password_token.key
    ).delete()

    # context for email templates
    context = {
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'token': reset_password_token.key,
    }

    email_html_message = render_to_string('email/password_reset_email.html', context)
    email_plaintext_message = render_to_string('email/password_reset_email.txt', context)

    # Brevo API
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.environ.get('BREVO_API_KEY')

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": reset_password_token.user.email}],
        sender={"email": "berrachedizineb5@gmail.com", "name": "Torbati"},
        subject="Password Reset for Torbati",
        text_content=email_plaintext_message,
        html_content=email_html_message
    )

    api_instance.send_transac_email(email)