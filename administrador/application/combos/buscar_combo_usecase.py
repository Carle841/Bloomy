from administrador.domain.combos.combo_repository_port import ComboRepositoryPort

class BuscarComboUseCase:
    def __init__(self, repo: ComboRepositoryPort):
        self.repo = repo

    def execute(self, filtro: str):
        return self.repo.find(filtro)
