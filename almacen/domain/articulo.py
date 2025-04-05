class Articulo:
    def __init__(self, id: int, nombre: str, precio: str):
        self._id = id
        self._nombre = nombre
        self._precio = precio

    def id(self) -> int:
        return self._id

    def precio(self) -> str:
        return self._precio

    def nombre(self) -> str:
        return self._nombre

    def setPrecio(self, value: str) -> None:
        self._precio = value

    def setNombre(self, value: str) -> None:
        self._nombre = value
