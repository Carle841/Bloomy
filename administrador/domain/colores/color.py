class Color:
    def __init__(self, color_id: int, nombre: str, codigo_hex: str):   
        self._id = color_id
        self._nombre = nombre
        self._codigo_hex = codigo_hex

    def get_id(self) -> int: return self._id
    def get_nombre(self) -> str: return self._nombre
    def get_codigo_hex(self) -> str: return self._codigo_hex

    def set_nombre(self, nombre: str): self._nombre = nombre
    def set_codigo_hex(self, codigo_hex: str): self._codigo_hex = codigo_hex
