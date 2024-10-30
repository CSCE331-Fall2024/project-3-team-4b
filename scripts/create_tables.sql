-- Container Table 
CREATE TABLE container (
    container_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number_of_drinks INTEGER NOT NULL,
    number_of_entrees INTEGER NOT NULL,
    number_of_sides INTEGER NOT NULL,
    number_of_appetizers INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL  
);

-- Menu Table 
CREATE TABLE menu (
    menu_id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    extra_cost NUMERIC(10, 2) NOT NULL,  
    name VARCHAR(255) NOT NULL
);

-- Inventory Table 
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost NUMERIC(10, 2) NOT NULL, 
    max_qty INTEGER NOT NULL,
    qty INTEGER NOT NULL
);

-- Employees Table 
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL 
);

-- Recipes Table 
CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    menu_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    inventory_id INTEGER NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE
);

-- Orders Table 
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    time TIMESTAMP NOT NULL,  
    total NUMERIC(10, 2) NOT NULL, 
    employee_id INTEGER NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- Order Items Table 
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    container_id INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (container_id) REFERENCES container(container_id) ON DELETE CASCADE
);

-- Menu Items Table 
CREATE TABLE menu_items (
    menu_item_id SERIAL PRIMARY KEY,
    order_item_id INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE CASCADE
);
