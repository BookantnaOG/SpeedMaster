# speedmaster/middleware.py
from django.shortcuts import render

class Custom404Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # หากเกิดข้อผิดพลาด 404, 500, 403 หรือ 400, เราจะแสดงหน้า Error.html
        response = self.get_response(request)
        if response.status_code == 404:
            return render(request, 'Error.html', {'error_code': 404}, status=404)
        elif response.status_code == 500:
            return render(request, 'Error.html', {'error_code': 500}, status=500)
        elif response.status_code == 403:
            return render(request, 'Error.html', {'error_code': 403}, status=403)
        elif response.status_code == 400:
            return render(request, 'Error.html', {'error_code': 400}, status=400)
        
        return response
