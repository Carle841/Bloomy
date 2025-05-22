class Imagen:
    def __init__(self, id, producto_id, url):
        self.__id = id
        self.__producto_id = producto_id
        self.__url = url

    def get_id(self):
        return self.__id

    def get_producto_id(self):
        return self.__producto_id

    def get_url(self):
        return self.__url
