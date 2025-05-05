class Usuario:
    def __init__(self, id: int, nombre: str, email: str, rol: str, estado: str):
        self._id = id
        self._nombre = nombre
        self._email = email
        self._rol = rol
        self._estado = estado

    def get_id(self) -> int:
        return self._id

    def get_nombre(self) -> str:
        return self._nombre

    def get_email(self) -> str:
        return self._email

    def get_rol(self) -> str:
        return self._rol

    def get_estado(self) -> str:
        return self._estado

    def set_nombre(self, valor: str):
        self._nombre = valor

    def set_email(self, valor: str):
        self._email = valor

    def set_rol(self, valor: str):
        self._rol = valor

    def set_estado(self, valor: str):
        self._estado = valor

    def __str__(self):
        return f"Usuario [id={self._id}, nombre={self._nombre}, email={self._email}, rol={self._rol}, estado={self._estado}]"