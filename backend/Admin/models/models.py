from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from bson import ObjectId
from utils.db_connection import mongo_db


user_collection = mongo_db["users"]
 

class User:
    def __init__(self, name, email, password, role="admin", id=None):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        hashed_password = self.hash_password(self.password)
        user_document = {
            "name": self.name,
            "email": self.email,
            "password": hashed_password,
            "role": self.role,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        result = user_collection.insert_one(user_document)
        self.id = str(result.inserted_id)
        return self.id
    
    @staticmethod
    def hash_password(raw_password):
        return make_password(raw_password)
    
    @staticmethod    
    def check_password(stored_hash, raw_password):
        return check_password(raw_password, stored_hash)
        
    @classmethod
    def authenticate(cls, email, password):
        user = user_collection.find_one({"email": email, "role": "admin"})
        if not user:
            return None
        
        if cls.check_password(user["password"], password):
            return cls.from_document(user)
        
    @classmethod
    def from_document(cls, doc):
        user = cls (
            name=doc.get("name"),
            email=doc.get("email"),
            password=doc.get("password"),
            role=doc.get("role"),
        )
        user.id = str(doc.get("_id"))
        user.created_at = doc.get("created_at")
        user.updated_at = doc.get("updated_at")
        return user
    
    @classmethod
    def get_by_id(cls, user_id):
        try:
            user_doc = user_collection.find_one({"_id": ObjectId(user_id)})
            if user_doc:
                return cls.from_document(user_doc)
            return None
        except Exception:
            return None
        
    @property
    def is_authenticated(self):
        return True
    
    
    def __str__(self):
        return f"Admin(name={self.name}, email={self.email}, role={self.role})"
