class Icono:
    def __init__(self, id: int, nombre: str, url: str):
        self._id = id
        self._nombre = nombre
        self._url = url

    def get_id(self) -> int: return self._id
    def get_nombre(self) -> str: return self._nombre
    def get_url(self) -> str: return self._url

    def set_nombre(self, nombre: str): self._nombre = nombre
    def set_url(self, url: str): self._url = url
