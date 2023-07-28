from django.db import models
from django.utils import timezone
from Device.models import *


def get_formatted_datetimessss():
    now = datetime.now()
    formatted_datetime = now.strftime("%H:%M")
    return formatted_datetime

        
class BmsVisitorActivity(models.Model):
    STATUS = [
        ('Requested', 'Requested'),
        ('Accepted', 'Accepted'),
        ('In_progress', 'In_progress'),
        ('Completed', 'Completed'),
        ('Cancel', 'Cancel')
    ]
    DELETE=[
        ("No","No"),
        ("Yes","Yes")
    ]
    user = models.ForeignKey(to='Authenticate.BmsUsersDetail', on_delete=models.CASCADE, blank=True, related_name='user_details',null=True)
    meeting_person = models.CharField(max_length=23, blank=True)
    to_meet_user = models.ForeignKey(to='Authenticate.BmsUser', on_delete=models.CASCADE, blank=True, related_name='meet_activities',null=True)
    department_name = models.CharField(max_length=23, blank=True)
    meeting_time = models.TimeField(blank=True,null=True)
    meeting_purpose = models.CharField(max_length=23, blank=True)
    visiter_type=models.CharField(max_length=222,blank=True)
    in_time = models.TimeField(blank=True)
    out_time = models.TimeField(blank=True)
    out_remark = models.CharField(max_length=12, blank=True)
    rfid_id = models.IntegerField(blank=True)
    status = models.CharField(max_length=23, choices=STATUS, blank=True)
    access_from_time = models.CharField(default=str(get_formatted_datetimessss()),max_length=999,null=True,blank=True)
    access_to_time =  models.CharField(default=str(get_formatted_datetimessss()),max_length=999,null=True,blank=True)
    is_deleted=models.CharField(max_length=233,choices=DELETE,default=DELETE[0][0])
    access_area = models.ManyToManyField(BmsSubAreaMaster,blank=True)
    enter_by = models.ForeignKey(to='Authenticate.BmsUser', on_delete=models.CASCADE, blank=True, related_name='entered_activities',null=True)
    locker= models.ForeignKey(BmsLocker,on_delete=models.CASCADE,blank=True,null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.meeting_person

    class Meta:
        db_table = 'Bms_visitor_activity'
        
        
        

 