class Categoria:
    def __init__(self, id: int, nombre: str, descripcion:str, estado: str, icono_id: int, color_id: int):
        self._id = id
        self._nombre = nombre
        self._descripcion = descripcion
        self._estado = estado
        self._icono_id = icono_id
        self._color_id = color_id

    def get_id(self) -> int : return self._id
    def get_nombre(self) -> str : return self._nombre
    def get_descripcion(self) -> str: return self._descripcion
    def get_estado(self) -> str: return self._estado
    def get_icono_id(self) -> int : return self._icono_id
    def get_color_id(self) -> int: return self._color_id

    def set_nombre(self, nombre: str): self._nombre = nombre
    def set_descripcion(self, descripcion: str): self._descripcion = descripcion
    def set_estado(self, estado : str): self._estado = estado
    def set_icono_id(self, icono_id : int): self._icono_id = icono_id
    def set_color_id(self, color_id: int): self._color_id = color_id
