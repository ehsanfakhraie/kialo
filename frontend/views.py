from django.shortcuts import render

# Create your views here.



def index(request):
    return render(request, 'frontend/index.html')
def index2(request, id):
    return render(request, "frontend/index.html")
