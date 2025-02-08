from django.db import models
from django.conf import settings
import re
from utils.db_connection import mongo_db
from datetime import datetime
from bson import ObjectId


carousal_collection = mongo_db["carousal"]
 

class Carousal:
    def __init__(self, image=None):
        self.image = image
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        
    
    def save(self):
        carousal_document = {
            "image": self.image,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        result = carousal_collection.insert_one(carousal_document)
        return result.inserted_id
    
    @staticmethod
    def get_all_carousals():
        carousals = carousal_collection.find()  
        carousals = list(carousals)  
        return carousals
    
    @staticmethod
    def get_one_carousal(carousal_id):
        result = carousal_collection.find_one({"_id": ObjectId(carousal_id)})
        return result

    @staticmethod
    def delete_one_carousal(carousal_id):
        result = carousal_collection.delete_one({"_id": ObjectId(carousal_id)})
        return result.deleted_count
    
    def __str__(self):
        return f"Carousal(image={self.image})"  