class Coleccion:
    def __init__(self, id: int, nombre: str, descripcion: str, imagen_url: str, estado: str, fecha_creacion):
        self.__id = id
        self.__nombre = nombre
        self.__descripcion = descripcion
        self.__imagen_url = imagen_url
        self.__estado = estado
        self.__fecha_creacion = fecha_creacion

    def get_id(self) -> int : return self.__id
    def get_nombre(self) -> str : return self.__nombre
    def get_descripcion(self) -> str : return self.__descripcion
    def get_imagen_url(self) -> str : return self.__imagen_url
    def get_estado(self) -> str : return self.__estado
    def get_fecha_creacion(self): return self.__fecha_creacion


    def set_nombre(self, nombre: str): self.__nombre = nombre
    def set_descripcion(self, descripcion: str): self.__descripcion = descripcion
    def set_imagen_url(self, imagen_url: str): self.__imagen_url = imagen_url
    def set_estado(self, estado: str): self.__estado = estado
    def set_fecha_creacion(self, fecha_creacion): self.__fecha_creacion = fecha_creacion