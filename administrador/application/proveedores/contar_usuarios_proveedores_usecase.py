class ContarUsuariosYProveedoresUseCase:
    def __init__(self, usuario_repo, proveedor_repo):
        self.usuario_repo = usuario_repo
        self.proveedor_repo = proveedor_repo

    def execute(self):
        total_usuarios = self.usuario_repo.count_all()
        total_proveedores = self.proveedor_repo.count_all()
        return total_usuarios + total_proveedores
