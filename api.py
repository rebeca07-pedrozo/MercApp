from fastapi import FastAPI
from db import get_connection

app = FastAPI()

@app.get("/productos")
def obtener_productos():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, nombre, marca, precio, tienda
        FROM productos
        ORDER BY nombre;
    """)

    columnas = [desc[0] for desc in cursor.description]
    filas = cursor.fetchall()

    cursor.close()
    conn.close()

    # Convertir a lista de diccionarios
    resultados = []
    for fila in filas:
        resultados.append(dict(zip(columnas, fila)))

    return resultados
