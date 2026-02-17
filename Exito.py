import requests
import json
import csv
import time

url = "https://www.exito.com/api/graphql"

# Variables base
variables = {
    "first": 16,
    "after": "0",
    "sort": "score_desc",
    "term": "",
    "selectedFacets": [
        {"key": "category-1", "value": "mercado"},
        {"key": "category-2", "value": "aseo-del-hogar"},
        {"key": "category-3", "value": "jabones-detergentes-y-limpiadores"},
        {"key": "channel", "value": "{\"salesChannel\":\"1\",\"regionId\":\"\"}"},
        {"key": "locale", "value": "es-CO"}
    ]
}

headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json"
}

all_products = []

print("Iniciando scraping...")

# Primero obtenemos el total de productos
params = {
    "operationName": "SearchQuery",
    "variables": json.dumps(variables)
}

response = requests.get(url, params=params, headers=headers)
data = response.json()

total_products = data["data"]["search"]["products"]["pageInfo"]["totalCount"]

print(f"Total productos encontrados: {total_products}")

# Paginación
for offset in range(0, total_products, 16):
    print(f"Extrayendo productos {offset} a {offset + 16}...")

    variables["after"] = str(offset)

    params = {
        "operationName": "SearchQuery",
        "variables": json.dumps(variables)
    }

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    products = data["data"]["search"]["products"]["edges"]

    for p in products:
        node = p["node"]

        name = node["name"]
        brand = node["brand"]["name"]
        sku = node["sku"]

        seller_info = node["items"][0]["sellers"][0]["commertialOffer"]

        price = seller_info["Price"]
        list_price = seller_info["ListPrice"]
        stock = seller_info["AvailableQuantity"]

        all_products.append([
            sku,
            name,
            brand,
            price,
            list_price,
            stock
        ])

    time.sleep(0.5)  # pequeña pausa para no saturar

# Guardar en CSV
with open("productos.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["SKU", "Nombre", "Marca", "Precio", "Precio Lista", "Stock"])
    writer.writerows(all_products)

print("Scraping terminado.")
print(f"Productos guardados en productos.csv")
