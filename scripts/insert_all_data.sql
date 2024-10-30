\COPY container(container_id, name, number_of_drinks, number_of_entrees, number_of_sides, number_of_appetizers, price) FROM '../assets/container.csv' DELIMITER ',' CSV HEADER;
\COPY employees (employee_id, name, role, salary) FROM '../assets/employees.csv' DELIMITER ',' CSV HEADER;
\COPY menu(menu_id, type, extra_cost, name) FROM '../assets/menu.csv' DELIMITER ',' CSV HEADER;
\COPY orders(order_id, time, total, employee_id) FROM '../assets/orders.csv' DELIMITER ',' CSV HEADER;
\COPY order_items(order_item_id, order_id, quantity, container_id) FROM '../assets/order_items.csv' DELIMITER ',' CSV HEADER;
\COPY menu_items(menu_item_id, order_item_id, menu_id) FROM '../assets/menu_items.csv' DELIMITER ',' CSV HEADER;
\COPY inventory(inventory_id, name, cost, max_qty, qty) FROM '../assets/inventory.csv' DELIMITER ',' CSV HEADER;
\COPY recipes(recipe_id, menu_id, qty, inventory_id) FROM '../assets/recipes.csv' DELIMITER ',' CSV HEADER;
