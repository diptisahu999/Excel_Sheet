from django.contrib import admin
from .models import BmsVisitorActivity

# Register your models here.
    
    
@admin.register(BmsVisitorActivity)
class AdminBmsVisitorActivity(admin.ModelAdmin):
    list_display=['id','meeting_purpose','in_time','out_time']

    