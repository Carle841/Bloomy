from administrador.domain.combos.combo_repository_port import ComboRepositoryPort

class ObtenerComboUseCase:
    def __init__(self, repo: ComboRepositoryPort):
        self.repo = repo

    def execute(self, id):
        combo = self.repo.get_by_id(id)
        if not combo:
            raise Exception("Combo no encontrado")
        return combo
