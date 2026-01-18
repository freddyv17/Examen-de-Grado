#!/usr/bin/env python3
"""
Backend API Tests for Maribel Farmacia - DELETE Functionality
Tests DELETE endpoints to ensure only admin users can delete resources
"""

import requests
import json
import sys
from datetime import datetime

# API Configuration
BASE_URL = "https://pharma-pos-12.preview.emergentagent.com/api"

# Test credentials
CREDENTIALS = {
    "admin": {"username": "admin", "password": "admin123"},
    "vendedor": {"username": "vendedor", "password": "vendedor123"},
    "consulta": {"username": "consulta", "password": "consulta123"}
}

class PharmacyAPITester:
    def __init__(self):
        self.tokens = {}
        self.test_results = []
        self.created_resources = {
            "products": [],
            "categories": [],
            "suppliers": [],
            "customers": [],
            "users": []
        }
    
    def log_result(self, test_name, expected, actual, passed, details=""):
        """Log test result"""
        result = {
            "test": test_name,
            "expected": expected,
            "actual": actual,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not passed:
            print(f"   Expected: {expected}, Got: {actual}")
    
    def login_user(self, role):
        """Login and get token for a user role"""
        try:
            creds = CREDENTIALS[role]
            response = requests.post(
                f"{BASE_URL}/auth/login",
                json=creds,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.tokens[role] = data["access_token"]
                print(f"✅ Login successful for {role}")
                return True
            else:
                print(f"❌ Login failed for {role}: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Login error for {role}: {str(e)}")
            return False
    
    def get_headers(self, role):
        """Get authorization headers for a role"""
        if role not in self.tokens:
            return None
        return {"Authorization": f"Bearer {self.tokens[role]}"}
    
    def create_test_category(self):
        """Create a test category for deletion testing"""
        try:
            headers = self.get_headers("admin")
            category_data = {
                "name": "Test Category DELETE",
                "description": "Category created for DELETE testing"
            }
            
            response = requests.post(
                f"{BASE_URL}/categories",
                json=category_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                category = response.json()
                self.created_resources["categories"].append(category["id"])
                return category["id"]
            else:
                print(f"Failed to create test category: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error creating test category: {str(e)}")
            return None
    
    def create_test_supplier(self):
        """Create a test supplier for deletion testing"""
        try:
            headers = self.get_headers("admin")
            supplier_data = {
                "name": "Test Supplier DELETE",
                "contact_person": "Juan Test",
                "phone": "555-TEST",
                "email": "test@supplier.com",
                "address": "Test Address 123"
            }
            
            response = requests.post(
                f"{BASE_URL}/suppliers",
                json=supplier_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                supplier = response.json()
                self.created_resources["suppliers"].append(supplier["id"])
                return supplier["id"]
            else:
                print(f"Failed to create test supplier: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error creating test supplier: {str(e)}")
            return None
    
    def create_test_customer(self):
        """Create a test customer for deletion testing"""
        try:
            headers = self.get_headers("admin")
            customer_data = {
                "name": "Cliente Test DELETE",
                "phone": "555-TEST",
                "email": "test@customer.com",
                "address": "Test Customer Address 456"
            }
            
            response = requests.post(
                f"{BASE_URL}/customers",
                json=customer_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                customer = response.json()
                self.created_resources["customers"].append(customer["id"])
                return customer["id"]
            else:
                print(f"Failed to create test customer: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error creating test customer: {str(e)}")
            return None
    
    def create_test_product(self, category_id, supplier_id):
        """Create a test product for deletion testing"""
        try:
            headers = self.get_headers("admin")
            product_data = {
                "name": "Producto Test DELETE",
                "description": "Product created for DELETE testing",
                "category_id": category_id,
                "supplier_id": supplier_id,
                "price": 10.50,
                "cost": 6.00,
                "stock": 25,
                "min_stock": 5,
                "barcode": "TEST123456789"
            }
            
            response = requests.post(
                f"{BASE_URL}/products",
                json=product_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                product = response.json()
                self.created_resources["products"].append(product["id"])
                return product["id"]
            else:
                print(f"Failed to create test product: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error creating test product: {str(e)}")
            return None
    
    def create_test_user(self):
        """Create a test user for deletion testing"""
        try:
            headers = self.get_headers("admin")
            user_data = {
                "username": "testuser_delete",
                "email": "testuser@delete.com",
                "password": "testpass123",
                "role": "consulta",
                "full_name": "Usuario Test DELETE"
            }
            
            response = requests.post(
                f"{BASE_URL}/users",
                json=user_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                user = response.json()
                self.created_resources["users"].append(user["id"])
                return user["id"]
            else:
                print(f"Failed to create test user: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error creating test user: {str(e)}")
            return None
    
    def test_delete_endpoint(self, endpoint, resource_id, role, expected_status):
        """Test DELETE endpoint with specific role"""
        try:
            headers = self.get_headers(role)
            if not headers:
                self.log_result(
                    f"DELETE {endpoint} as {role}",
                    expected_status,
                    "No token",
                    False,
                    f"Failed to get token for {role}"
                )
                return False
            
            response = requests.delete(
                f"{BASE_URL}/{endpoint}/{resource_id}",
                headers=headers,
                timeout=10
            )
            
            passed = response.status_code == expected_status
            details = f"Response: {response.text[:200]}" if response.text else ""
            
            self.log_result(
                f"DELETE {endpoint} as {role}",
                expected_status,
                response.status_code,
                passed,
                details
            )
            
            return passed
        except Exception as e:
            self.log_result(
                f"DELETE {endpoint} as {role}",
                expected_status,
                f"Error: {str(e)}",
                False,
                f"Exception occurred: {str(e)}"
            )
            return False
    
    def run_all_tests(self):
        """Run all DELETE endpoint tests"""
        print("🧪 Starting Maribel Farmacia DELETE API Tests")
        print("=" * 60)
        
        # Step 1: Login all users
        print("\n📋 Step 1: User Authentication")
        for role in CREDENTIALS.keys():
            if not self.login_user(role):
                print(f"❌ Cannot continue without {role} login")
                return False
        
        # Step 2: Create test resources
        print("\n📋 Step 2: Creating Test Resources")
        category_id = self.create_test_category()
        supplier_id = self.create_test_supplier()
        customer_id = self.create_test_customer()
        user_id = self.create_test_user()
        
        if not all([category_id, supplier_id, customer_id, user_id]):
            print("❌ Failed to create required test resources")
            return False
        
        product_id = self.create_test_product(category_id, supplier_id)
        if not product_id:
            print("❌ Failed to create test product")
            return False
        
        print(f"✅ Created test resources:")
        print(f"   Category: {category_id}")
        print(f"   Supplier: {supplier_id}")
        print(f"   Customer: {customer_id}")
        print(f"   Product: {product_id}")
        print(f"   User: {user_id}")
        
        # Step 3: Test DELETE with non-admin users (should fail with 403)
        print("\n📋 Step 3: Testing DELETE with Non-Admin Users (Should Fail)")
        
        # Test with consulta user (should get 403)
        self.test_delete_endpoint("products", product_id, "consulta", 403)
        self.test_delete_endpoint("categories", category_id, "consulta", 403)
        self.test_delete_endpoint("suppliers", supplier_id, "consulta", 403)
        self.test_delete_endpoint("customers", customer_id, "consulta", 403)
        self.test_delete_endpoint("users", user_id, "consulta", 403)
        
        # Test with vendedor user (should get 403)
        self.test_delete_endpoint("products", product_id, "vendedor", 403)
        self.test_delete_endpoint("categories", category_id, "vendedor", 403)
        self.test_delete_endpoint("suppliers", supplier_id, "vendedor", 403)
        self.test_delete_endpoint("customers", customer_id, "vendedor", 403)
        self.test_delete_endpoint("users", user_id, "vendedor", 403)
        
        # Step 4: Test DELETE with admin user (should succeed with 200)
        print("\n📋 Step 4: Testing DELETE with Admin User (Should Succeed)")
        
        self.test_delete_endpoint("products", product_id, "admin", 200)
        self.test_delete_endpoint("categories", category_id, "admin", 200)
        self.test_delete_endpoint("suppliers", supplier_id, "admin", 200)
        self.test_delete_endpoint("customers", customer_id, "admin", 200)
        self.test_delete_endpoint("users", user_id, "admin", 200)
        
        # Step 5: Test DELETE non-existent resources (should get 404)
        print("\n📋 Step 5: Testing DELETE Non-Existent Resources (Should Get 404)")
        
        fake_id = "non-existent-id-12345"
        self.test_delete_endpoint("products", fake_id, "admin", 404)
        self.test_delete_endpoint("categories", fake_id, "admin", 404)
        self.test_delete_endpoint("suppliers", fake_id, "admin", 404)
        self.test_delete_endpoint("customers", fake_id, "admin", 404)
        self.test_delete_endpoint("users", fake_id, "admin", 404)
        
        return True
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["passed"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["passed"]:
                    print(f"   - {result['test']}: Expected {result['expected']}, Got {result['actual']}")
                    if result["details"]:
                        print(f"     Details: {result['details']}")
        
        return failed_tests == 0

def main():
    """Main test execution"""
    tester = PharmacyAPITester()
    
    try:
        success = tester.run_all_tests()
        all_passed = tester.print_summary()
        
        if all_passed:
            print("\n🎉 ALL TESTS PASSED! DELETE functionality is working correctly.")
            sys.exit(0)
        else:
            print("\n⚠️  SOME TESTS FAILED! Check the results above.")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()