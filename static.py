import os
from flask import Flask, send_from_directory, abort

app = Flask(__name__)

# Define o caminho absoluto da pasta static dentro de cstatic
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')

# Garante que a pasta existe
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

@app.route('/<path:filename>')
def serve_static(filename):
    # Tenta enviar o arquivo da pasta static
    try:
        return send_from_directory(STATIC_DIR, filename)
    except FileNotFoundError:
        abort(404)

if __name__ == '__main__':
    print(f"Servidor Estático rodando em: https://192.168.0.150:7071")
    # Rodando na porta 7071
    app.run(host='0.0.0.0', port=7071, debug=True, ssl_context=(r"L:\xingia\192.168.0.150.pem", r"L:\xingia\192.168.0.150-key.pem"))