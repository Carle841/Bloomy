class Producto:
    def __init__(self, id: int, nombre: str, codigo: str, categoria_id: int, precio:float, stock: int, estado: str, descripcion: str, imagenes=None):
        self.__id = id
        self.__nombre = nombre
        self.__codigo = codigo
        self.__categoria_id = categoria_id
        self.__precio = precio
        self.__stock = stock
        self.__estado = estado
        self.__descripcion = descripcion
        self.__imagenes = imagenes or []

    def get_id(self):
        return self.__id

    def get_nombre(self):
        return self.__nombre

    def get_codigo(self):
        return self.__codigo

    def get_categoria_id(self):
        return self.__categoria_id

    def get_precio(self):
        return self.__precio

    def get_stock(self):
        return self.__stock

    def get_estado(self):
        return self.__estado

    def get_descripcion(self):
        return self.__descripcion

    def get_imagenes(self):
        return self.__imagenes

    def set_imagenes(self, imagenes):
        self.__imagenes = imagenes
