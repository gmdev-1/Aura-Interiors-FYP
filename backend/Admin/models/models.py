from django.db import models
from django.conf import settings
import re
import bcrypt
from django.core.exceptions import ValidationError
from utils.db_connection import mongo_db
from datetime import datetime
from bson import ObjectId


user_collection = mongo_db["users"]
 

class User:
    def __init__(self, name, email, password, role="admin"):
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        user_document = {
            "name": self.name,
            "email": self.email,
            "password": self.hash_password(self.password),
            "role": self.role,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        result = user_collection.insert_one(user_document)
        return result.inserted_id
    
    @staticmethod
    def hash_password(raw_password):
        return bcrypt.hashpw(raw_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    @staticmethod
    def check_password(hash_password, raw_password):
        return bcrypt.checkpw(raw_password.encode("utf-8"), hash_password.encode("utf-8"))
    
    def save(self):
        if user_collection.find_one({"email": self.email}):
            raise ValueError("Admin with this email already exists")
        
        if user_collection.find_one({"password": self.password}):
            raise ValueError("Admin with this password already exists")
        
    @classmethod
    def authenticate(cls, email, password):
        user = user_collection.find_one({"email": email})
        if not user:
            return None
        
        if cls.check_password(user["password"], password):
            return cls(
                name=user['name'],
                email=user['email'],
                password=user['password'],
                role=user['role'],
            )
        return None
    
    
    def __str__(self):
        return f"Category(name={self.name}, email={self.email})"
