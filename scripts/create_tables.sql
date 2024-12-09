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


-- Note: ADD Calories field
-- -- Container Table
-- CREATE TABLE container (
--     container_id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL UNIQUE, -- Ensures no duplicate container names
--     number_of_drinks INTEGER NOT NULL CHECK (number_of_drinks >= 0), -- Enforce non-negative values
--     number_of_entrees INTEGER NOT NULL CHECK (number_of_entrees >= 0),
--     number_of_sides INTEGER NOT NULL CHECK (number_of_sides >= 0),
--     number_of_appetizers INTEGER NOT NULL CHECK (number_of_appetizers >= 0),
--     price NUMERIC(10, 2) NOT NULL CHECK (price >= 0) -- Enforce non-negative prices
-- );

-- -- Menu Table
-- CREATE TABLE menu (
--     menu_id SERIAL PRIMARY KEY,
--     type VARCHAR(255) NOT NULL CHECK (type IN ('Drink', 'Entree', 'Side', 'Appetizer')), -- Limit types to predefined categories
--     extra_cost NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (extra_cost >= 0), -- Enforce non-negative costs
--     name VARCHAR(255) NOT NULL UNIQUE -- Avoid duplicate menu item names
-- );

-- -- Inventory Table
-- CREATE TABLE inventory (
--     inventory_id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL UNIQUE, -- Ensure unique inventory names
--     cost NUMERIC(10, 2) NOT NULL CHECK (cost >= 0), -- Enforce non-negative cost
--     max_qty INTEGER NOT NULL CHECK (max_qty > 0), -- Max quantity must be positive
--     qty INTEGER NOT NULL CHECK (qty >= 0 AND qty <= max_qty) -- Quantity must be within range
-- );

-- -- Employees Table
-- CREATE TABLE employees (
--     employee_id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     role VARCHAR(255) NOT NULL CHECK (role IN ('Cashier', 'Manager', 'Cook')), -- Limit roles to predefined categories
--     salary NUMERIC(10, 2) NOT NULL CHECK (salary >= 0) -- Enforce non-negative salaries
-- );

-- -- Recipes Table
-- CREATE TABLE recipes (
--     recipe_id SERIAL PRIMARY KEY,
--     menu_id INTEGER NOT NULL,
--     qty INTEGER NOT NULL CHECK (qty > 0), -- Quantity must be positive
--     inventory_id INTEGER NOT NULL,
--     FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE CASCADE,
--     FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE
-- );

-- -- Orders Table
-- CREATE TABLE orders (
--     order_id SERIAL PRIMARY KEY,
--     time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Automatically use the current time
--     total NUMERIC(10, 2) NOT NULL CHECK (total >= 0), -- Enforce non-negative totals
--     employee_id INTEGER NOT NULL,
--     FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
-- );

-- -- Order Items Table
-- CREATE TABLE order_items (
--     order_item_id SERIAL PRIMARY KEY,
--     order_id INTEGER NOT NULL,
--     quantity INTEGER NOT NULL CHECK (quantity > 0), -- Quantity must be positive
--     container_id INTEGER NOT NULL,
--     FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
--     FOREIGN KEY (container_id) REFERENCES container(container_id) ON DELETE CASCADE
-- );

-- -- Menu Items Table
-- CREATE TABLE menu_items (
--     menu_item_id SERIAL PRIMARY KEY,
--     order_item_id INTEGER NOT NULL,
--     menu_id INTEGER NOT NULL,
--     FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
--     FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE CASCADE
-- );
