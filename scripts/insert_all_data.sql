\COPY container(container_id, name, number_of_drinks, number_of_entrees, number_of_sides, number_of_appetizers, price) FROM 'data/container.csv' DELIMITER ',' CSV HEADER;
\COPY employees (employee_id, name, role, salary) FROM 'data/employees.csv' DELIMITER ',' CSV HEADER;
\COPY menu(menu_id, type, extra_cost, name) FROM 'data/menu.csv' DELIMITER ',' CSV HEADER;
\COPY orders(order_id, time, total, employee_id) FROM 'data/orders.csv' DELIMITER ',' CSV HEADER;
\COPY order_items(order_item_id, order_id, quantity, container_id) FROM 'data/order_items.csv' DELIMITER ',' CSV HEADER;
\COPY menu_items(menu_item_id, order_item_id, menu_id) FROM 'data/menu_items.csv' DELIMITER ',' CSV HEADER;
\COPY inventory(inventory_id, name, cost, max_qty, qty) FROM 'data/inventory.csv' DELIMITER ',' CSV HEADER;
\COPY recipes(recipe_id, menu_id, qty, inventory_id) FROM 'data/recipes.csv' DELIMITER ',' CSV HEADER;
