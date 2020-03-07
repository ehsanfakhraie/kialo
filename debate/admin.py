from django.contrib import admin

# Register your models here.
from debate.models import *

admin.site.register(Claim)
admin.site.register(Discussion)
admin.site.register(Comment)
admin.site.register(Vote)

