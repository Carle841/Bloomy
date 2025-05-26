from administrador.domain.combos.combo import Combo
from administrador.domain.combos.combo_repository_port import ComboRepositoryPort
from datetime import datetime

class CrearComboUseCase:
    def __init__(self, combos_repo: ComboRepositoryPort):
        self.combos_repo = combos_repo

    def execute(self, nombre: str, descripcion: str, stock: int, descuento_porcentaje: float, imagen_principal: str, estado: bool) -> int:
        nuevo_id = self.combos_repo.next_identity()

        combo = Combo(
            id=nuevo_id,
            nombre=nombre,
            descripcion=descripcion,
            stock=stock,
            descuento_porcentaje=descuento_porcentaje,
            imagen_principal=imagen_principal,
            fecha_creacion=datetime.now(),
            estado=estado,
            precio_sin_descuento=0.0,
            precio_con_descuento=0.0
        )

        self.combos_repo.store(combo)
        return nuevo_id
