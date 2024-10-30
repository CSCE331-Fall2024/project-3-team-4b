import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

start_date = datetime(2023, 10, 1)
end_date = datetime(2024, 9, 29)

target_sales = 1_005_000
employee_ids = np.arange(1, 9)

menu_items = {
    "Bowl": 8.30,
    "Plate": 9.80,
    "Bigger Plate": 11.30,
    "Bowl + Drink": 10.40,
    "Plate + Drink": 11.90,
    "Bigger Plate + Drink": 13.40,
    "A La Carte Entree (Small)": 5.20,
    "A La Carte Entree (Medium)": 8.50,
    "A La Carte Entree (Large)": 11.20,
    "A La Carte Premium Entree (Small)": 6.70,
    "A La Carte Premium Entree (Medium)": 11.50,
    "A La Carte Premium Entree (Large)": 15.70,
    "A La Carte Side (Medium)": 4.40,
    "A La Carte Side (Large)": 5.40,
}

menu_probabilities = np.array(
    [0.10, 0.15, 0.12, 0.12, 0.12, 0.08, 0.06, 0.06, 0.05, 0.05, 0.04, 0.03, 0.02, 0.02]
)
menu_probabilities = menu_probabilities / menu_probabilities.sum()

item_name_to_container_id = {
    "Bowl": 1,
    "Plate": 2,
    "Bigger Plate": 3,
    "Bowl + Drink": 4,
    "Plate + Drink": 5,
    "Bigger Plate + Drink": 6,
    "A La Carte Entree (Small)": 7,
    "A La Carte Entree (Medium)": 8,
    "A La Carte Entree (Large)": 9,
    "A La Carte Premium Entree (Small)": 10,
    "A La Carte Premium Entree (Medium)": 11,
    "A La Carte Premium Entree (Large)": 12,
    "A La Carte Side (Medium)": 13,
    "A La Carte Side (Large)": 14,
}

container_id_to_details = {
    1: {
        "name": "Bowl",
        "number_of_drinks": 0,
        "number_of_entrees": 1,
        "number_of_sides": 1,
    },
    2: {
        "name": "Plate",
        "number_of_drinks": 0,
        "number_of_entrees": 2,
        "number_of_sides": 1,
    },
    3: {
        "name": "Bigger Plate",
        "number_of_drinks": 0,
        "number_of_entrees": 3,
        "number_of_sides": 1,
    },
    4: {
        "name": "Bowl + Drink",
        "number_of_drinks": 1,
        "number_of_entrees": 1,
        "number_of_sides": 1,
    },
    5: {
        "name": "Plate + Drink",
        "number_of_drinks": 1,
        "number_of_entrees": 2,
        "number_of_sides": 1,
    },
    6: {
        "name": "Bigger Plate + Drink",
        "number_of_drinks": 1,
        "number_of_entrees": 3,
        "number_of_sides": 1,
    },
    7: {
        "name": "A La Carte Entree (Small)",
        "number_of_drinks": 0,
        "number_of_entrees": 1,
        "number_of_sides": 0,
    },
    8: {
        "name": "A La Carte Entree (Medium)",
        "number_of_drinks": 0,
        "number_of_entrees": 1,
        "number_of_sides": 0,
    },
    9: {
        "name": "A La Carte Entree (Large)",
        "number_of_drinks": 0,
        "number_of_entrees": 1,
        "number_of_sides": 0,
    },
    10: {
        "name": "A La Carte Premium Entree (Small)",
        "number_of_drinks": 0,
        "number_of_entrees": 1,
        "number_of_sides": 0,
    },
    11: {
        "name": "A La Carte Premium Entree (Medium)",
        "number_of_drinks": 0,
        "number_of_entrees": 1,
        "number_of_sides": 0,
    },
    12: {
        "name": "A La Carte Premium Entree (Large)",
        "number_of_drinks": 0,
        "number_of_entrees": 1,
        "number_of_sides": 0,
    },
    13: {
        "name": "A La Carte Side (Medium)",
        "number_of_drinks": 0,
        "number_of_entrees": 0,
        "number_of_sides": 1,
    },
    14: {
        "name": "A La Carte Side (Large)",
        "number_of_drinks": 0,
        "number_of_entrees": 0,
        "number_of_sides": 1,
    },
}

entree_items = [
    {"name": "The Original Orange Chicken", "menu_id": 9},
    {"name": "Grilled Teriyaki Chicken", "menu_id": 10},
    {"name": "Broccoli Beef", "menu_id": 12},
    {"name": "Mushroom Chicken", "menu_id": 13},
    {"name": "Sweet Fire Chicken Breast", "menu_id": 14},
]

premium_entree_items = [{"name": "Honey Walnut Shrimp", "menu_id": 11}]

side_items = [
    {"name": "Chow Mein", "menu_id": 5},
    {"name": "Fried Rice", "menu_id": 6},
    {"name": "White Steamed Rice", "menu_id": 7},
    {"name": "Super Greens", "menu_id": 8},
]

drink_items = [
    {"name": "Dr Pepper", "menu_id": 15},
    {"name": "Sweet Tea", "menu_id": 16},
    {"name": "Pepsi", "menu_id": 17},
    {"name": "Mountain Dew", "menu_id": 18},
    {"name": "Sierra Mist", "menu_id": 19},
    {"name": "Water", "menu_id": 20},
]

appetizer_items = [
    {"name": "Chicken Egg Roll", "menu_id": 1},
    {"name": "Veggie Spring Roll", "menu_id": 2},
    {"name": "Cream Cheese Rangoon", "menu_id": 3},
    {"name": "Apple Pie Roll", "menu_id": 4},
]

high_sales_saturdays = [start_date + timedelta(weeks=np.random.randint(1, 52)) for _ in range(2)]
high_sales_saturdays = [
    s + timedelta(days=(5 - s.weekday())) for s in high_sales_saturdays
]

store_hours = {
    "Sunday": (11, 20),
    "Monday": (10, 21),
    "Tuesday": (10, 21),
    "Wednesday": (10, 21),
    "Thursday": (10, 21),
    "Friday": (10, 21),
    "Saturday": (10, 21),
}

orders_data = []
order_items_data = []
menu_items_data = []
order_id = 1
order_item_id = 1
menu_item_id = 1

current_date = start_date
while current_date <= end_date:
    day_name = current_date.strftime("%A")
    open_hour, close_hour = store_hours[day_name]

    is_saturday = current_date.weekday() == 5
    is_special_saturday = current_date in high_sales_saturdays

    employee_pool = np.random.choice(employee_ids, size=3, replace=False)

    if is_special_saturday:
        order_count = np.random.randint(450, 550)
    elif is_saturday:
        order_count = np.random.randint(350, 450)
    else:
        order_count = np.random.randint(150, 250)

    current_order_time = current_date + timedelta(
        hours=np.random.randint(open_hour, close_hour), minutes=np.random.randint(0, 60)
    )

    for _ in range(order_count):
        if np.random.rand() < 0.2:
            current_order_time = current_date + timedelta(
                hours=np.random.randint(open_hour, close_hour),
                minutes=np.random.randint(0, 60),
            )

        num_items = np.random.randint(1, 3)
        selected_items = np.random.choice(
            list(menu_items.keys()), size=num_items, p=menu_probabilities, replace=True
        )
        order_total = 0

        for item_name in selected_items:
            container_id = item_name_to_container_id[item_name]
            container_price = menu_items[item_name]
            order_total += container_price

            order_items_data.append(
                {
                    "order_item_id": order_item_id,
                    "order_id": order_id,
                    "quantity": 1,
                    "container_id": container_id,
                }
            )

            container_details = container_id_to_details[container_id]

            for _ in range(container_details.get("number_of_drinks", 0)):
                menu_item = np.random.choice(drink_items)
                menu_items_data.append(
                    {
                        "menu_item_id": menu_item_id,
                        "order_item_id": order_item_id,
                        "menu_id": menu_item["menu_id"],
                    }
                )
                menu_item_id += 1

            for _ in range(container_details.get("number_of_entrees", 0)):
                if container_id in [10, 11, 12]:
                    menu_item = np.random.choice(premium_entree_items)
                else:
                    menu_item = np.random.choice(entree_items)
                menu_items_data.append(
                    {
                        "menu_item_id": menu_item_id,
                        "order_item_id": order_item_id,
                        "menu_id": menu_item["menu_id"],
                    }
                )
                menu_item_id += 1

            for _ in range(container_details.get("number_of_sides", 0)):
                menu_item = np.random.choice(side_items)
                menu_items_data.append(
                    {
                        "menu_item_id": menu_item_id,
                        "order_item_id": order_item_id,
                        "menu_id": menu_item["menu_id"],
                    }
                )
                menu_item_id += 1

            for _ in range(container_details.get("number_of_appetizers", 0)):
                menu_item = np.random.choice(appetizer_items)
                menu_items_data.append(
                    {
                        "menu_item_id": menu_item_id,
                        "order_item_id": order_item_id,
                        "menu_id": menu_item["menu_id"],
                    }
                )
                menu_item_id += 1

            order_item_id += 1

        orders_data.append(
            {
                "order_id": order_id,
                "time": current_order_time,
                "total": round(order_total, 2),
                "employee_id": int(np.random.choice(employee_pool)),
            }
        )
        order_id += 1

    current_date += timedelta(days=1)

df_orders = pd.DataFrame(orders_data)
df_order_items = pd.DataFrame(order_items_data)
df_menu_items = pd.DataFrame(menu_items_data)

total_sales = df_orders["total"].sum()
if total_sales < target_sales:
    scaling_factor = target_sales / total_sales
    df_orders["total"] = (df_orders["total"] * scaling_factor).round(2)

df_orders.to_csv("orders.csv", index=False)
df_order_items.to_csv("order_items.csv", index=False)
df_menu_items.to_csv("menu_items.csv", index=False)
