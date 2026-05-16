# Notas do Projeto Ancora Timer

## Como rodar o projeto

### Backend
Abra um terminal na pasta raiz e execute:
```bash
cd backend
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

uvicorn app.main:app --reload --port 8000
```

### Frontend
Abra outro terminal na pasta raiz e execute:
```bash
cd frontend
npm run dev
```

## URLs de Acesso

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Documentação API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

## Configuração Inicial (First Time Setup)

- As migrações do Backend já foram executadas (SQLite em `backend/pomodoro_test.db`).
- As dependências do Frontend já foram instaladas.
- Clique em **"Start Timer"** na página inicial para começar.


## Kill process Frontend
 taskkill /PID 36840 /F 