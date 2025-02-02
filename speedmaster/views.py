from django.shortcuts import render

def index(request):
    context = {'message': 'This is a dynamic message!'}
    return render(request, 'index.html',{"Message":"Hello"})

