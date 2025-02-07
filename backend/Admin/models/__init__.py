# Admin/models/__init__.py
from .category import Category
from .product import Product

__all__ = ["Category", "Product"]  # Optional, helps with `from Admin.models import *`
