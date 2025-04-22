from django.db import models
from django.conf import settings
import re
from utils.db_connection import mongo_db
from datetime import datetime
from bson import ObjectId


category_collection = mongo_db["category"]
 

class Category:
    def __init__(self, name, description="", image=None):
        self.name = name
        self.description = description
        self.image = image
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        category_document = {
            "name": self.name,
            "description": self.description,
            "image": self.image,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        result = category_collection.insert_one(category_document)
        return result.inserted_id

    
    @staticmethod
    def get_all_categories():
        categories = category_collection.find()  
        categories = list(categories)  
        return categories

    @staticmethod
    def delete_one_category(category_id):
        result = category_collection.delete_one({"_id": ObjectId(category_id)})
        return result.deleted_count
    
    @staticmethod
    def get_one_category(category_id):
        result = category_collection.find_one({"_id": ObjectId(category_id)})
        return result
    
    @staticmethod
    def update_one_category(category_id, update_data):
        update_data["updated_at"] = datetime.utcnow()
        result = category_collection.update_one(
            {"_id": ObjectId(category_id)},
            {"$set": update_data}
            )
        return result.modified_count
    
    def __str__(self):
        return f"Category(name={self.name}, description={self.description}, image={self.image})"
