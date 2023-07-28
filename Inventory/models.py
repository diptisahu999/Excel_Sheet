from django.db import models

# Create your models here.
class Bms_inventory_category(models.Model):
    STATUS= [
        ("A","Active"),
        ("N","In-Active"),
    ]
    category_name=models.CharField(max_length=100)
    category_image=models.ImageField(upload_to='uploads/', blank=True)
    status=models.CharField(max_length=100, choices=STATUS)
    created_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.category_name
    
    class Meta():
        db_table='inventory_tbl'
        
class Bms_item_details(models.Model):
    ORDER=[
        ("M","Manual"),
        ("A","Amazon"),
        ("F","Flipkart"),
    ]
    
    STATUS= [
        ("A","Active"),
        ("N","In-Active"),
    ]
    
    category_id=models.ManyToManyField(Bms_inventory_category, related_name='items')
    item_name=models.CharField(max_length=100)
    item_description=models.TextField(max_length=300)
    item_image=models.ImageField(upload_to='uploads/')
    price=models.FloatField()
    unit=models.CharField(max_length=10)
    stock_quantity=models.FloatField()
    minimum_quantity=models.IntegerField(default=5)
    order_from=models.CharField(max_length=100, choices=ORDER)
    status=models.CharField(max_length=100, choices=STATUS)
    created_at=models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return self.item_name
    
    class Meta():
        db_table='item_details_tbl'
        
class Bms_manage_inventory_stock(models.Model):
    item_id=models.ManyToManyField(Bms_item_details, related_name='manage_stock')
    supplier_name=models.CharField(max_length=100)
    stock_quantity=models.FloatField()
    unit=models.CharField(max_length=10)
    price=models.FloatField()
    total=models.FloatField(editable=False)
    grand_total=models.FloatField()
    created_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.supplier_name
    
    def save(self, *args, **kwargs):
        self.total=self.stock_quantity*self.price
        super(Bms_manage_inventory_stock,self).save(*args,**kwargs)
    
    #Inventory effect
        inventory=Bms_manage_inventory_stock.objects.filter(item_id=self.item_id).order_by('-id').first()
        if inventory:
            totalBal=inventory.grand_total-self.stock_quantity
        else:
            totalBal=self.stock_quantity
            
        inventory.objects.create(
            stock_quantity=self.stock_quantity,
            grand_total=totalBal
        )
        

    
    class Meta():
        db_table='manage_inventory_tbl'
        
    
    
    
