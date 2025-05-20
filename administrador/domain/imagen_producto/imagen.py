class Imagen:
    def __init__(self, imagen_id, producto_id, url):
        self.__id = imagen_id
        self.__producto_id = producto_id
        self.__url = url

    def get_id(self):
        return self.__id

    def get_producto_id(self):
        return self.__producto_id

    def get_url(self):
        return self.__url
