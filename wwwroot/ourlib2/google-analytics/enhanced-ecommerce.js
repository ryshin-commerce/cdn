/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

var EnhancedEcommerce = {
    // converting initialize data
    AddImpression(id, name, variant) {
        gtag('event', 'view_item',
            {
                'items': [
                    { // Provide product details in an impressionFieldObject.
                        'id': id, // Product ID (string).
                        'name': name, // Product name (string).
                        'variant': variant // Product variant (string).
                        
                    }
                ]
            }
        );
    },

    AddProduct(id, name, variant, category, brand, price, quantity = 1) {
        gtag('event', 'add_to_cart',
            {
                'items': [
                    { // Provide product details in an impressionFieldObject.
                        'id': id, // Product ID (string).
                        'name': name, // Product name (string).
                        'category': category, // Product category (string).
                        'brand': brand, // Product brand (string).
                        'variant': variant, // Product variant (string).
                        // Product position (number).
                        'price': price, // Custom dimension (string).
                        //'position': 1                     // Product position (number).
                        'quantity': quantity
                    }
                ]
            }
        );
    },

    Purchase(orderId, price, items) {
        gtag('event', 'purchase', {
            "transaction_id": orderId,
            "affiliation": "Webapp Order",
            "value": price,
            "currency": "VND",
            "shipping": 0,
            "items": items
        });
    }

};

