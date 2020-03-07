
from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index), # match the root
    path('discussion/',views.index),
    path('discussion//',views.index),
    path('login/',views.index),
    path('register/',views.index),
    path('profile/',views.index),
    path('add-discussion/',views.index),
    # path('discussion/<id>/',views.index)

]

urlpatterns+= [

    url(r'^discussion/(?P<id>\d+)/$', views.index2),

]