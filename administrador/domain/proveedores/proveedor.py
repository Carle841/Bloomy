class Proveedor:
    def __init__(self, id: int, nombre: str, contacto: str, telefono: str, email: str, direccion: str):
        self._id = id
        self._nombre = nombre
        self._contacto = contacto
        self._telefono = telefono
        self._email = email
        self._direccion = direccion

    def get_id(self) -> int:
        return self._id

    def get_nombre(self) -> str:
        return self._nombre

    def get_contacto(self) -> str:
        return self._contacto

    def get_telefono(self) -> str:
        return self._telefono

    def get_email(self) -> str:
        return self._email

    def get_direccion(self) -> str:
        return self._direccion

    def set_nombre(self, valor: str):
        self._nombre = valor

    def set_contacto(self, valor: str):
        self._contacto = valor

    def set_telefono(self, valor: str):
        self._telefono = valor

    def set_email(self, valor: str):
        self._email = valor

    def set_direccion(self, valor: str):
        self._direccion = valor
