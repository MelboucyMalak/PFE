from rest_framework.response import Response
from rest_framework import serializers as drf_serializers
from rest_framework import status
from .error import ERROR_CODES


def error_response(key, http_status=status.HTTP_400_BAD_REQUEST):
    error = ERROR_CODES[key]

    return Response(
        {
            "error_code": error["code"],
            "error": error["message"]
        },
        status=http_status
    )
def serializer_error(key):
    error = ERROR_CODES[key]
    raise drf_serializers.ValidationError({
        "error_code": error["code"],
        "error": error["message"]
    })