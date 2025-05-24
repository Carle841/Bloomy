class Imagen:
    def __init__(self, id:int, producto_id:int, url:str, descripcion:str):
        self._id = id
        self._producto_id = producto_id
        self._url = url
        self._descripcion = descripcion

    def get_id(self) -> int : return self._id
    def get_producto_id(self) -> int : return self._producto_id
    def get_url(self) -> str : return self._url
    def get_descripcion(self) -> str : return self._descripcion
    
    def set_producto_id(self, producto_id: int): self._producto_id = producto_id
    def set_url(self, url: str): self._url = url
    def set_descripcion(self, descripcion: str): self._descripcion = descripcion
