from django.shortcuts import render
from django.http import HttpResponse

def dashboard(request):
    return render(request, 'index.html')

def edit(request):
    return render(request, 'edit.html')