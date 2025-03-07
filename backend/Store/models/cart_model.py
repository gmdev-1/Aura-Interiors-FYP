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
        self.id = None
        
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
        self.id = result.inserted_id
        return result
    
    @classmethod
    def create_cart_item(cls, user_id, product_data, quantity=1):
        product_id = str(product_data.get("_id"))
        existing = cart_collection.find_one({"user_id": user_id, "product_id": product_id})
        if existing:
            new_quantity = existing.get("quantity", 1) + quantity
            update_data = {
                "quantity": new_quantity,
                "updated_at": datetime.utcnow()
            }
            cart_collection.update_one(
                {"_id": ObjectId(existing["_id"])},
                {"$set": update_data}
            )
            updated_item = cart_collection.find_one({"_id": existing["_id"]})
            return updated_item, None
        else:
            cart_item = cls(
                user_id=user_id,
                product_id=str(product_data.get("_id")),
                product_name=product_data.get("name", ""),
                price=product_data.get("price", 0),
                quantity=quantity,
                image=product_data.get("image", ""),
                discount=product_data.get("discount", 0),
                size=product_data.get("size", ""),
                color=product_data.get("color", ""),
                material=product_data.get("material", "")
            )
        cart_item.save()
        return cart_item

    @classmethod
    def get_cart_items(cls, user_id):
        items = cart_collection.find({"user_id": user_id})
        return list(items)

    @classmethod
    def update_cart_item(cls, cart_item_id, user_id, update_data):
        update_data["updated_at"] = datetime.utcnow()
        existing = cart_collection.find_one({"_id": ObjectId(cart_item_id), "user_id": user_id})
        result = cart_collection.update_one(
            {"_id": ObjectId(cart_item_id), "user_id": user_id},
            {"$set": update_data}
        )
        if result.modified_count > 0 and result.modified_count == 0:
            return 1
        return result.modified_count

    @classmethod
    def delete_cart_item(cls, cart_item_id, user_id):
        result = cart_collection.delete_one({"_id": ObjectId(cart_item_id), "user_id": user_id})
        return result.deleted_count