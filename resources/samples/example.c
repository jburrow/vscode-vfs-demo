/* C Example - Demonstrates structs, pointers, and memory management */
/* Use this file to validate C extension support on VFS */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NAME_LENGTH 50
#define MAX_ITEMS 100

/* Structure definition */
typedef struct {
    int id;
    char name[MAX_NAME_LENGTH];
    double price;
} Product;

/* Dynamic array structure */
typedef struct {
    Product* items;
    size_t count;
    size_t capacity;
} ProductList;

/* Initialize product list */
ProductList* create_product_list(size_t initial_capacity) {
    ProductList* list = (ProductList*)malloc(sizeof(ProductList));
    if (list == NULL) {
        return NULL;
    }
    
    list->items = (Product*)malloc(sizeof(Product) * initial_capacity);
    if (list->items == NULL) {
        free(list);
        return NULL;
    }
    
    list->count = 0;
    list->capacity = initial_capacity;
    return list;
}

/* Add product to list */
int add_product(ProductList* list, int id, const char* name, double price) {
    if (list->count >= list->capacity) {
        size_t new_capacity = list->capacity * 2;
        Product* new_items = (Product*)realloc(list->items, sizeof(Product) * new_capacity);
        if (new_items == NULL) {
            return -1;
        }
        list->items = new_items;
        list->capacity = new_capacity;
    }
    
    Product* p = &list->items[list->count];
    p->id = id;
    strncpy(p->name, name, MAX_NAME_LENGTH - 1);
    p->name[MAX_NAME_LENGTH - 1] = '\0';
    p->price = price;
    list->count++;
    
    return 0;
}

/* Find product by ID */
Product* find_product(ProductList* list, int id) {
    for (size_t i = 0; i < list->count; i++) {
        if (list->items[i].id == id) {
            return &list->items[i];
        }
    }
    return NULL;
}

/* Free product list */
void free_product_list(ProductList* list) {
    if (list != NULL) {
        free(list->items);
        free(list);
    }
}

/* Print all products */
void print_products(const ProductList* list) {
    printf("Products (%zu items):\n", list->count);
    for (size_t i = 0; i < list->count; i++) {
        printf("  [%d] %s - $%.2f\n", 
               list->items[i].id, 
               list->items[i].name, 
               list->items[i].price);
    }
}

int main(void) {
    ProductList* products = create_product_list(10);
    if (products == NULL) {
        fprintf(stderr, "Failed to create product list\n");
        return 1;
    }
    
    add_product(products, 1, "Laptop", 999.99);
    add_product(products, 2, "Mouse", 29.99);
    add_product(products, 3, "Keyboard", 79.99);
    
    print_products(products);
    
    Product* found = find_product(products, 2);
    if (found != NULL) {
        printf("\nFound: %s at $%.2f\n", found->name, found->price);
    }
    
    free_product_list(products);
    return 0;
}
