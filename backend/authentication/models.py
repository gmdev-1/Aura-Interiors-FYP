from django.db import models
import bcrypt
from django.conf import settings
import re
from utils.db_connection import mongo_db


def validate_phone(phone):
    phone_regex=r'^\+?1?\d{9,12}$'
    if not re.match(phone_regex, phone):
        raise ValueError("Phone number must be entered in the format: '+XX-XXX-XXXXXXX'..")

def validate_email(email):
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, email):
        raise ValueError("Email must be entered in the format: 'example@gmail.com'.")

def validate_password(password):
    password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d#£@$!%*?&]{8,}$'
    if not re.match(password_regex, password):
        raise ValueError("Password must have at least 8 characters, including uppercase, lowercase, digits, and special characters.")

user_collection = mongo_db["users"]

class User:
    def __init__(self, name, email, phone, password):
        validate_email(email)
        validate_phone(phone)
        validate_password(password)

        self.name = name
        self.email = email
        self.phone = phone
        self.password = self.hash_password(password)

    @staticmethod
    def hash_password(raw_password):
        
        return bcrypt.hashpw(raw_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def check_password(hashed_password, raw_password):
        
        return bcrypt.checkpw(raw_password.encode("utf-8"), hashed_password.encode("utf-8"))

    def save(self):
        
        user_document = {
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "password": self.password,
        }
        result = user_collection.insert_one(user_document)
        return result.inserted_id

    @staticmethod
    def find_by_email(email):
        user_data =  user_collection.find_one({"email": email})
        if not user_data:
            return None
        
        return User(
            name=user_data.get("name"),
            email=user_data.get("email"),
            phone=user_data.get("phone"),
            password=user_data.get("password"),
        )

    def __str__(self):
        return f"User(email={self.email}, name={self.name}, phone={self.phone})"