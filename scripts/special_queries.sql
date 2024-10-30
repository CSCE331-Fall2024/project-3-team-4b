
/* QUERY 1
pseudocode: select count of orders grouped by week
about: given a specific week, how many orders were placed?
example: "week 1 has 98765 orders"
*/
SELECT 
    EXTRACT(YEAR FROM time) AS year, 
    EXTRACT(WEEK FROM time) AS week, 
    COUNT(order_id) AS order_count
FROM 
    orders
GROUP BY 
    year, week
ORDER BY 
    year ASC, week ASC;
------------------------------------------------------------

/* QUERY 2
Special Query #2: "Realistic Sales History"

pseudocode: select count of orders, sum of order total grouped by hour
about: given a specific hour of the day, how many orders were placed and what was the total sum of the orders?
example: e.g., "12pm has 12345 orders totaling $86753"
*/
SELECT 
    EXTRACT(HOUR FROM time) AS hour, 
    COUNT(order_id) AS order_count, 
    SUM(total) AS total_sales
FROM 
    orders
GROUP BY 
    hour
ORDER BY 
    hour ASC;


----------------------------------------------------------

/* QUERY 3
Special Query #3: "Peak Sales Day"

pseudocode: select top 10 sums of order total grouped by day in descending order by order total
about: given a specific day, what was the sum of the top 10 order totals?
example: "30 August has $12345 of top sales"
*/

SELECT 
    DATE(time) AS day, 
    SUM(total) AS total_sales
FROM 
    orders
GROUP BY 
    day
ORDER BY 
    total_sales DESC
LIMIT 10;

----------------------------------------------------------

/* QUERY 4
pseudocode: connect to database, write a query joining menu, recipe, and inventory, grouping by menu.name and counting inventory_id, execute query and display results
about: calculates how many different inventory items (ingredients) are used for each menu item by counting the linked inventory items in the recipe table
example: for Chicken Egg Roll and Veggie Spring Roll, the output shows 2 inventory items each, while Cream Cheese Rangoon uses 1 item
*/

SELECT 
    m.name AS menu_item, 
    COUNT(r.inventory_id) AS inventory_item_count
FROM 
    menu m
JOIN 
    recipes r ON m.menu_id = r.menu_id
JOIN 
    inventory i ON r.inventory_id = i.inventory_id
GROUP BY 
    m.name;

----------------------------------------------------------










