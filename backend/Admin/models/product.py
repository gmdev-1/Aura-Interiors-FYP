from django.db import models
from django.conf import settings
import re
from utils.db_connection import mongo_db
from datetime import datetime
from bson import ObjectId


product_collection = mongo_db["product"]
category_collection = mongo_db["category"]

class Product:
    def __init__(self, name, description, category_id, price, image, quantity, discount, color, size, material, rating, review, is_featured):
        self.name = name
        self.description = description
        self.category_id = ObjectId(category_id)
        self.price = price
        self.discount = discount
        self.image = image
        self.quantity = quantity
        self.color = color
        self.size = size
        self.material = material
        self.rating = rating
        self.review = review
        self.is_featured = is_featured
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def save(self):
        product_document = {
            "name": self.name,
            "description": self.description,
            "image": self.image,
            "price": self.price,
            "category": self.category_id,
            "quantity": self.quantity,
            "discount": self.discount,
            "color": self.color,
            "size": self.size,
            "material": self.material,
            "rating": self.rating,
            "review": self.review,
            "is_featured": self.is_featured,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
        result = product_collection.insert_one(product_document)
        return result.inserted_id
    
    @staticmethod
    def get_all_products():
        pipeline = [
            {
                "$lookup": {
                    "from": "category",
                    "localField": "category",
                    "foreignField": "_id",
                    "as": "category_info"
                }
            },
            {
                "$unwind": {
                    "path": "$category_info",
                    "preserveNullAndEmptyArrays": True
                }
            }
        ]
        products = list(product_collection.aggregate(pipeline))
        
        for product in products:
            product["id"] = str(product.get("_id"))
            product["category"] = product.get("category_info", {}).get("name")
            product.pop("_id", None)
            product.pop("category_info", None)
        return products
    
    @staticmethod
    def get_one_product(product_id):
        pipeline = [
            { "$match": {"_id": ObjectId(product_id)}},
            {
                "$lookup": {
                    "from": "category",
                    "localField": "category",
                    "foreignField": "_id",
                    "as": "category_info"
                }
            },
            {
                "$unwind": {
                    "path": "$category_info",
                    "preserveNullAndEmptyArrays": True
                }
            }
        ]
        product_cursor = product_collection.aggregate(pipeline)
        product_list = list(product_cursor)
        if not product_list:
            return None
        product = product_list[0]
        
        product["id"] = str(product.get("_id"))
        product["category_id"] = str(product.get("category"))
        product["category"] = product.get("category_info", {}).get("name")
        product.pop("_id", None)
        product.pop("category_info", None)
        return product
    
    @staticmethod
    def delete_one_product(product_id):
        result = product_collection.delete_one({"_id": ObjectId(product_id)})
        return result.deleted_count
    
    @staticmethod
    def update_one_product(product_id, update_product_data):
        if "category" in update_product_data:
            update_product_data["category"] = ObjectId(update_product_data["category"])
            
        update_product_data["updated_at"] = datetime.utcnow()
        result = product_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_product_data}
        )
        return result.modified_count
    
    @staticmethod
    def search(q: str):
        return list(product_collection.find({
            "$or": [
                {"name":        {"$regex": q, "$options": "i"}},
                {"description": {"$regex": q, "$options": "i"}}
            ]
        }, {"_id": 0}))

    @staticmethod
    def search_products(q: str, projection=None):
        q = q.strip()
        if not q:
            return []  # no search term → no results

        projection = projection or {
            "_id":         0,
            "id":          1,
            "name":        1,
            "description": 1,
            "price":       1,
            "image":       1,
            "is_featured": 1,
            "rating":      1,
            "review":      1,
            "discount":    1,
        }

        filter_q = {
            "$or": [
                {"name":        {"$regex": q, "$options": "i"}},
                {"description": {"$regex": q, "$options": "i"}}
            ]
        }
        return list(product_collection.find(filter_q, projection))


    @staticmethod
    def all():
        # fetch all products for initial load
        projection = {"_id":0, "id":1, "name":1, "description":1, "price":1, "image":1, "is_featured":1, "rating":1, "review":1, "discount":1}
        return list(product_collection.find({}, projection))

    
    
    def __str__(self):
        return f"Product(name={self.name}, description={self.description}, image={self.image}, price={self.price}, category={self.category}, quantity={self.quantity}, discount={self.discount})"