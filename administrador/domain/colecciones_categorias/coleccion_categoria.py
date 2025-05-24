class ColeccionCategoria:
    def __init__(self, coleccion_id: int, categoria_id: int):
        self.__coleccion_id = coleccion_id
        self.__categoria_id = categoria_id

    def get_coleccion_id(self) -> int:
        return self.__coleccion_id

    def get_categoria_id(self) -> int:
        return self.__categoria_id
    
    def set_coleccion_id(self, coleccion_id: int) -> None:
        self.__coleccion_id = coleccion_id
    def set_categoria_id(self, categoria_id: int) -> None:
        self.__categoria_id = categoria_id
