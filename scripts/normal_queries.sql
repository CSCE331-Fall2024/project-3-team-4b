/* 
QUERY 1
List all containers with their prices
*/

SELECT name, price
FROM container;

/* 
QUERY 2
Find all employees with a salary greater than $50,000
*/

SELECT name, salary
FROM employees
WHERE salary > 50000;

/* 

QUERY 3
Retrieve the total number of drinks in all containers
*/

SELECT sum(number_of_drinks)
FROM container;

/* 
QUERY 4
Get all menu items with their extra cost and type
*/

SELECT name, type, extra_cost
FROM menu;

/* 
QUERY 5
List all orders placed by a specific employee (e.g., employee_id = 1)
*/

SELECT order_id, time, total
FROM orders
WHERE employee_id = 1;

/* 
QUERY 6
Find all orders placed within the last week
*/

SELECT *
FROM orders
WHERE time >= NOW() - INTERVAL '7 DAYS';

/* 
QUERY 7
Show all inventory items that are running low (e.g., quantity less than 10)
*/

SELECT *
FROM inventory
WHERE quantity < 10;

/* 
QUERY 8
Get the average price of all containers
*/

SELECT AVG(price) AS average_price
FROM container;

/* 
QUERY 9
List all employees and their roles
*/

SELECT name, role
FROM employees;

/* 
QUERY 10
Find the recipe for a specific menu item (e.g., menu_id = 3)
*/

SELECT 
    r.recipe_id,
    m.name AS menu_item_name,
    i.name AS ingredient_name,
    r.qty AS quantity_required
FROM 
    recipes r
JOIN 
    menu m ON r.menu_id = m.menu_id
JOIN 
    inventory i ON r.inventory_id = i.inventory_id
WHERE 
    r.menu_id = 3;


/* 
QUERY 11
Retrieve all order items for a specific order (e.g., order_id = 5)
*/

SELECT *
FROM order_items
WHERE order_id = 5;

/* 
QUERY 12
Find all menu items that belong to a specific order item (e.g., order_item_id = 2)
*/

SELECT 
    mi.menu_item_id,
    m.name AS menu_name,
    m.type AS menu_type,
    m.extra_cost
FROM 
    menu_items mi
JOIN 
    menu m ON mi.menu_id = m.menu_id
WHERE 
    mi.order_item_id = 2;

/* 
QUERY 13
Calculate the total cost of an order (e.g., order_id = 5)
*/

SELECT SUM(m.extra_cost * oi.qty) AS total_cost
FROM order_items oi
JOIN menu m ON oi.menu_id = m.menu_id
WHERE oi.order_id = 5;

/* 
QUERY 14
List all recipes that use a specific inventory item (e.g., inventory_id = 1)
*/

SELECT *
FROM recipes
WHERE inventory_id = 1;

/* 
QUERY 15
Get the total quantity of a specific inventory item (e.g., inventory_id = 3) used in recipes
*/

SELECT SUM(qty) AS total_qty_used
FROM recipes
WHERE inventory_id = 3;
