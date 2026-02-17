from etl import procesar_archivos

def main():
    print("Iniciando proceso ETL...")

    try:
        procesar_archivos()
        print("Proceso finalizado correctamente ")

    except Exception as e:
        print("Ocurrió un error durante el ETL !!!!!")
        print(e)

if __name__ == "__main__":
    main()
