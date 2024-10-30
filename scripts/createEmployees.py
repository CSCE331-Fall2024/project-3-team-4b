import random
import csv

csv_file_path = 'girl_boy_names_2023.csv'

names = []

with open(csv_file_path, mode='r', newline='', encoding='utf-8') as file:
    reader = csv.reader(file, delimiter=',')
    next(reader)
    for row in reader:
        if len(row) >= 3:
            rank = row[0].strip()
            girl_name = row[1].strip()
            boy_name = row[2].strip()

            names.append(girl_name)
            names.append(boy_name)

# 80% Cashiers / 20% Managers
roles = [
    'Manager',
    'Cashier',
    'Cashier',
    'Cashier',
    'Cashier',
]

def generate_random_name():
    name = random.choice(names)
    return f"{name}"

def generate_random_salary():
    return int(random.uniform(30000, 60000))

def insert_random_employees(num_employees):
    with open('employees.csv', mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['employee_id','name', 'role', 'salary'])
        for employee_id in range(num_employees):
            name = generate_random_name()
            role = random.choice(roles)
            salary = generate_random_salary()
            if role == "Manager":
                salary *= 2
            writer.writerow([employee_id, name, role, salary])

        
        
        
num_employees_to_generate = 100
insert_random_employees(num_employees_to_generate)


print(f'{num_employees_to_generate} random employees added to CSV')
