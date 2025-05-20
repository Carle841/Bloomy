from administrador import app

if __name__ == '__main__':
    print("Rutas registradas:")
    
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint} -> {rule}")

    app.run(debug=True)

