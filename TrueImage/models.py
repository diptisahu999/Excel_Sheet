from django.db import models
from Device.models import *

# Create your models here.
class CroppedArea(models.Model):
    device_name = models.ForeignKey(BmsDeviceInformation,on_delete=models.CASCADE)
    crop_image_path = models.ImageField(upload_to='DeviceCrop/',blank=True,default=True)
    moveto =  models.BooleanField()
    shape_type = models.CharField(max_length=150)
    isInteractive = models.BooleanField()
    crop_object = models.JSONField(default=dict, null=True, blank=True)
    sub_area = models.ForeignKey(BmsSubAreaMaster,on_delete=models.CASCADE)
    index_number = models.IntegerField(null=True, blank=True)
    
    def __str__ (self):
        return self.device_name

    class Meta:
        db_table = 'cropped_area_tbl'