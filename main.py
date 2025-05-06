# administracion/app.py
from administrador.infrastructure.pg_command import PGCommand
from administrador.domain.usuarios.usuarios import Usuario
from administrador.infrastructure.usuarios.UsuariosRepositoryPgImpl import UsuarioRepositoryPgImpl

def main():
    # Configurar PGCommand
    db = PGCommand()
    usuario_repo = UsuarioRepositoryPgImpl(db)

    try:
        # 1. Crear un usuario
        nuevo_id = usuario_repo.next_identity()
        nuevo_usuario = Usuario(
            id=nuevo_id,
            nombre="Maria Lopez",
            email="maria@example.com",
            rol="1",
            estado="activo"
        )
        usuario_repo.store(nuevo_usuario)
        print(f"Usuario creado con ID: {nuevo_id}")

        # 2. Obtener usuario por ID
        usuario = usuario_repo.get_by_id(nuevo_id)
        print(f"Usuario obtenido: {usuario}")

        # 3. Actualizar usuario
        usuario.set_nombre("Maria Lopez Actualizada")
        usuario_repo.store(usuario)
        print("Usuario actualizado")

        # 4. Buscar usuarios
        resultados = usuario_repo.find("Lopez")
        print(f"Usuarios encontrados: {len(resultados)}")

        # 5. Eliminar usuario
        # usuario_repo.delete(nuevo_id)
        # print(f"Usuario {nuevo_id} eliminado")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()