from administrador.domain.combos.combo import Combo
from administrador.domain.combos.combo_repository_port import ComboRepositoryPort

class ComboService:
    def __init__(self, combo_repository: ComboRepositoryPort):
        self.combo_repository = combo_repository

    def add(self, combo: Combo) -> None:
        self.combo_repository.store(combo)

    def get_by_id(self, id: int) -> Combo | None:
        return self.combo_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list[Combo]:
        return self.combo_repository.find(filtro)

    def remove(self, id: int) -> None:
        self.combo_repository.delete(id)

    def update(self, combo: Combo) -> None:
        self.combo_repository.update(combo)

    def get_next_id(self) -> int:
        return self.combo_repository.next_identity()
