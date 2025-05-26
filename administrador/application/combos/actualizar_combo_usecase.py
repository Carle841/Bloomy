from administrador.domain.combos.combo import Combo
from administrador.domain.combos.combo_repository_port import ComboRepositoryPort
from datetime import datetime

class ActualizarComboUseCase:
    def __init__(self, combos_repo: ComboRepositoryPort):
        self.combos_repo = combos_repo

    def execute(self, id: int, nombre: str, descripcion: str, stock: int, descuento_porcentaje: float, imagen_principal: str, estado: bool):
        combo = self.combos_repo.find_by_id(id)
        if not combo:
            raise ValueError("Combo no encontrado")

        combo.set_nombre(nombre)
        combo.set_descripcion(descripcion)
        combo.set_stock(stock)
        combo.set_descuento_porcentaje(descuento_porcentaje)
        combo.set_imagen_principal(imagen_principal)
        combo.set_estado(estado)

        self.combos_repo.update(combo)
