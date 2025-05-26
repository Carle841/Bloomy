from administrador.domain.combos.combo_repository_port import ComboRepositoryPort

class EliminarComboUseCase:
    def __init__(self, repo: ComboRepositoryPort):
        self.repo = repo

    def execute(self, id):
        combo_existente = self.repo.get_by_id(id)
        if not combo_existente:
            raise Exception("Combo no encontrado")

        self.repo.delete(id)
