import pandas as pd
import os
from db import get_connection

CARPETA_DATOS = "datos"

def procesar_archivos():
    conn = get_connection()
    cursor = conn.cursor()

    for archivo in os.listdir(CARPETA_DATOS):
        if not archivo.endswith(".csv"):
            continue

        ruta = os.path.join(CARPETA_DATOS, archivo)
        df = pd.read_csv(ruta)

        # Detectar tienda por nombre del archivo
        if "exito" in archivo.lower():
            tienda = "Exito"
        elif "olimpica" in archivo.lower():
            tienda = "Olimpica"
        else:
            tienda = "Desconocida"

        # Insertar datos
        for _, row in df.iterrows():
            cursor.execute("""
                INSERT INTO productos (nombre, marca, precio, tienda)
                VALUES (%s, %s, %s, %s)
            """, (
                row.get("Nombre"),
                row.get("Marca"),
                row.get("Precio"),
                tienda
            ))

    conn.commit()
    cursor.close()
    conn.close()

    print("Datos insertados correctamente 🚀")
