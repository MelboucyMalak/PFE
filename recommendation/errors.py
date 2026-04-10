from rest_framework import status
from rest_framework.exceptions import APIException

class NotSuitableLand(APIException):
    status_code = 400
    default_detail = 'Land is not suitable for planting.'

class NotInsideALgeria(APIException):
    status_code = 400
    default_detail = 'Point is outside algeria.'

class InvalidData(APIException):
    status_code = 400
    default_detail = 'Data invalid or incomplete.'

