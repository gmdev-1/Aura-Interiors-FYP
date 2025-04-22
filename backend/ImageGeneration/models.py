from django.db import models
from django.conf import settings
from utils.db_connection import mongo_db
from datetime import datetime
from bson import ObjectId


imagen_collection = mongo_db["imagen"]
 

class Category:
    def __init__(self, name, image=None):
        self.name = name
        self.image = image
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        imagen_document = {
            "image": self.image,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        result = imagen_collection.insert_one(imagen_document)
        return result.inserted_id
    
    def __str__(self):
        return f"ImageGeneration(image={self.image})"

