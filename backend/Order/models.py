from django.db import models
from django.conf import settings
from datetime import datetime
from bson import ObjectId
from utils.db_connection import mongo_db


order_collection = mongo_db["orders"]
cart_collection = mongo_db["cart"]  

ORDER_STATUS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]

class Order:
    def __init__(self, user_id, items, total, shipping_details, payment_method="Cash on Delivery", payment_status="pending", order_status="pending"):
        self.order_id = str(ObjectId()) 
        self.user_id = user_id
        self.items = items
        self.total = total
        self.shipping_details = shipping_details
        self.payment_method = payment_method
        self.payment_status = payment_status  # e.g., pending, paid, failed
        self.order_status = order_status
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        """Saves the order to the database."""
        order_data = {
            "_id": self.order_id,
            "user_id": self.user_id,
            "items": self.items,
            "total": self.total,
            "shipping_details": self.shipping_details,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "order_status": self.order_status,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
        order_collection.insert_one(order_data)
        return self.order_id

    @classmethod
    def create_from_cart(cls, user_id, cart_items, shipping_details, payment_method="Cash on Delivery"):
        """Creates an order from cart items."""
        if not cart_items:
            raise ValueError("Cart is empty. Cannot create order.")

        # Convert cart items format
        order_items = [
            {
                "product_id": item["product_id"],
                "product_name": item["product_name"],
                "price": float(item["price"]),
                "quantity": item["quantity"],
                "image": item["image"],
                "size": item.get("size"),
                "color": item.get("color"),
            }
            for item in cart_items
        ]

        # Calculate total price
        total = round(sum(float(item["price"]) * item["quantity"] for item in cart_items), 2)

        # Create and save order
        order = cls(
            user_id=user_id,
            items=order_items,
            total=total,
            shipping_details=shipping_details,
            payment_method=payment_method,
            payment_status="pending",  # Default to pending
            order_status="pending"
        )
        order_id = order.save()

        # Clear the cart after successful order creation
        cls.clear_cart(user_id)

        return order_id

    @classmethod
    def find_by_user(cls, user_id, status=None):
        """Retrieves orders by user, optionally filtering by status."""
        query = {"user_id": user_id}
        if status:
            query["order_status"] = status
        return list(order_collection.find(query))

    @classmethod
    def update_status(cls, order_id, new_status):
        """Updates the order status."""
        if new_status not in ORDER_STATUS:
            raise ValueError("Invalid order status.")
        
        result = order_collection.update_one(
            {"_id": order_id},
            {"$set": {"order_status": new_status, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    @classmethod
    def update_payment_status(cls, order_id, payment_status):
        """Updates the payment status (e.g., paid, failed, refunded)."""
        result = order_collection.update_one(
            {"_id": order_id},
            {"$set": {"payment_status": payment_status, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    @classmethod
    def get_order_by_id(cls, order_id):
        """Finds an order by its ID."""
        return order_collection.find_one({"_id": order_id})

    @classmethod
    def clear_cart(cls, user_id):
        result = cart_collection.delete_many({"user_id": user_id})
        print("Deleted cart items count:", result.deleted_count)
        return result.deleted_count
    
    @classmethod
    def get_all_orders(cls):
        orders = list(order_collection.find({}))
        # Optionally transform orders here (e.g., add order_id from _id)
        for order in orders:
            order["order_id"] = str(order["_id"])
        return orders
    
    @staticmethod
    def search(q: str):
        return list(order_collection.find({
            "$or": [
                {"name":        {"$regex": q, "$options": "i"}},
                {"status": {"$regex": q, "$options": "i"}}
            ]
        }, {"_id": 0}))
