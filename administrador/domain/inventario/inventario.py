class Inventario:
    def __init__(self, id, nombre, descripcion, precio, proveedor_id):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio = precio
        self.proveedor_id = proveedor_id

    def get_id(self):
        return self.id

    def get_nombre(self):
        return self.nombre

    def get_descripcion(self):
        return self.descripcion

    def get_precio(self):
        return self.precio

    def get_proveedor_id(self):
        return self.proveedor_id
