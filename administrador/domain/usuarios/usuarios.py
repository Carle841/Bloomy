from datetime import datetime
class Usuario:
    def __init__(self, id: int, nombre: str, email: str, id_rol: int, estado: str, ultimo_acceso: datetime = None, fecha_registro: datetime = None, telefono: str = "", contraseña: str = ""):
        self._id = id
        self._nombre = nombre
        self._email = email
        self._rol = id_rol  
        self._estado = estado
        self._ultimo_acceso = ultimo_acceso
        self._fecha_registro = fecha_registro
        self._telefono = telefono
        self._contraseña = contraseña

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
        
    def set_telefono(self, valor: str):
        self._telefono = valor

    def set_email(self, valor: str):
        self._email = valor

    def set_rol(self, valor: str):
        self._rol = valor

    def set_estado(self, valor: str):
        self._estado = valor
        
    def set_contraseña(self, valor: str):
        self._contraseña = valor

    def get_ultimo_acceso(self):
        return self._ultimo_acceso

    def get_fecha_registro(self):
        return self._fecha_registro

    def get_telefono(self):
        return self._telefono

    def get_contraseña(self):
        return self._contraseña

    def set_ultimo_acceso(self, fecha: datetime):
        self._ultimo_acceso = fecha
        
    def set_fecha_registro(self, fecha: datetime):
        self._fecha_registro = fecha