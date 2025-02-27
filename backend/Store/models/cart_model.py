from django.db import models
from django.conf import settings
from datetime import datetime
from bson import ObjectId
from utils.db_connection import mongo_db

cart_collection = mongo_db["cart"]

class Cart:
    def __init__(self, user_id, product_id, product_name, price, quantity, image, discount, size, color, material):
        self.user_id = user_id
        self.product_id = product_id
        self.product_name = product_name
        self.price = price
        self.quantity = quantity
        self.image = image
        self.discount = discount
        self.size = size
        self.color = color
        self.material = material
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None
        
    def save(self):
        cart_data = {
            "user_id": self.user_id,
            "product_id": self.product_id,
            "product_name": self.product_name,
            "price": self.price,
            "quantity": self.quantity,
            "image": self.image,
            "discount": self.discount,
            "size": self.size,
            "color": self.color,
            "material": self.material,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
        result = cart_collection.insert_one(cart_data)
        return result
    
    
    @staticmethod
    def update_quantity(self, new_quantity):
        self.quantity = new_quantity
        self.updated_at = datetime.utcnow()
        result = cart_collection.update_one(
            {"_id": self._id},
            {"$set": {"quantity": self.quantity, "updated_at": self.updated_at}}
        )
        return result
    
    @staticmethod
    def get_cart_by_user(user_id):
        items = list(cart_collection.find({"user_id": user_id}))
        for item in items:
            item["_id"] = str(item.get("_id"))
        return items
    
    @staticmethod
    def remove_from_cart(user_id):
        result = cart_collection.delete_one({"_id": ObjectId(cart_item_id)})
        return result
        