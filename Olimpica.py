import requests
import re
import json
import csv
import time

base_url = "https://www.olimpica.com/supermercado/aseo-del-hogar"

headers = {"User-Agent": "Mozilla/5.0"}

all_products = []

max_pages = 10   #  LÍMITE DE PÁGINAS
page = 1

while page <= max_pages:   #  SOLO HASTA 10 PÁGINAS
    
    url = f"{base_url}?page={page}"
    
    print(f"Scrapeando página {page}")

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print("Error en la página")
        break

    html = response.text

    match = re.search(
        r'<template data-type="json" data-varname="__STATE__">\s*<script>(.*?)</script>',
        html,
        re.DOTALL
    )

    if not match:
        print("No se encontró __STATE__")
        break

    state = json.loads(match.group(1))

    page_products = 0

    for key, value in state.items():
        if isinstance(value, dict) and value.get("__typename") == "Product":

            name = value.get("productName")
            brand = value.get("brand")

            price = None
            price_range_id = value.get("priceRange", {}).get("id")

            if price_range_id and price_range_id in state:
                price_range_obj = state[price_range_id]
                selling_price_id = price_range_obj.get("sellingPrice", {}).get("id")

                if selling_price_id and selling_price_id in state:
                    selling_price_obj = state[selling_price_id]
                    price = selling_price_obj.get("lowPrice")

            all_products.append([name, brand, price])
            page_products += 1

    print(f"Productos encontrados en página {page}: {page_products}")

    if page_products == 0:
        break

    page += 1
    time.sleep(1)

print(f"\nTotal productos obtenidos: {len(all_products)}")

with open("olimpica_10_paginas.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Nombre", "Marca", "Precio"])
    writer.writerows(all_products)

print("Archivo olimpica_10_paginas.csv creado ")
