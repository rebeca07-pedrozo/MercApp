DROP TABLE IF EXISTS productos;

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    marca VARCHAR(255),
    precio DECIMAL(10,2),
    tienda VARCHAR(100),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM productos;