from django.contrib import admin
from TrueImage.models import * 

# Register your models here.


@admin.register(CroppedArea)
class BmsHardWareDetailsAdmin(admin.ModelAdmin):
    list_display=[
        'id'
    ]