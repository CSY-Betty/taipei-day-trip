from flask import Response
import json


def create_success_response(message, status_code):
    response_data = json.dumps(message, ensure_ascii=False)
    response = Response(
        response_data,
        status=status_code,
        content_type="application/json; charset=utf-8",
    )
    return response


def create_error_response(message, status_code):
    response_data = json.dumps({"error": True, "message": message}, ensure_ascii=False)
    response = Response(
        response_data,
        status=status_code,
        content_type="application/json; charset=utf-8",
    )
    return response
