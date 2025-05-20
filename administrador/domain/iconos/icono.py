class Icono:
    def __init__(self, id: int, nombre: str):
        self._id = id
        self._nombre = nombre

    def get_id(self) -> int: return self._id
    def get_nombre(self) -> str: return self._nombre

    def set_nombre(self, nombre: str): self._nombre = nombre
