from datetime import datetime

class Combo:
    def __init__(
        self,
        id: int,
        nombre: str,
        descripcion: str,
        stock: int,
        descuento_porcentaje: float,
        precio_sin_descuento: float,
        precio_con_descuento: float,
        imagen_principal: str = "",
        fecha_creacion: datetime = None,
        estado: bool = True
    ):
        self._id = id
        self._nombre = nombre
        self._descripcion = descripcion
        self._stock = stock
        self._descuento_porcentaje = descuento_porcentaje
        self._precio_sin_descuento = precio_sin_descuento
        self._precio_con_descuento = precio_con_descuento
        self._imagen_principal = imagen_principal
        self._fecha_creacion = fecha_creacion or datetime.now()
        self._estado = estado

    # Getters
    def get_id(self): return self._id
    def get_nombre(self): return self._nombre
    def get_descripcion(self): return self._descripcion
    def get_stock(self): return self._stock
    def get_descuento_porcentaje(self): return self._descuento_porcentaje
    def get_precio_sin_descuento(self): return self._precio_sin_descuento
    def get_precio_con_descuento(self): return self._precio_con_descuento
    def get_imagen_principal(self): return self._imagen_principal
    def get_fecha_creacion(self): return self._fecha_creacion
    def get_estado(self): return self._estado

    # Setters
    def set_nombre(self, valor): self._nombre = valor
    def set_descripcion(self, valor): self._descripcion = valor
    def set_stock(self, valor): self._stock = valor
    def set_descuento_porcentaje(self, valor): self._descuento_porcentaje = valor
    def set_precio_sin_descuento(self, valor): self._precio_sin_descuento = valor
    def set_precio_con_descuento(self, valor): self._precio_con_descuento = valor
    def set_imagen_principal(self, valor): self._imagen_principal = valor
    def set_estado(self, valor): self._estado = valor


