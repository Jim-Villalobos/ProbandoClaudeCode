# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the application (development mode)
python app.py

# Initialize database with tables and sample data
python init_db.py

# Install dependencies
pip install -r requirements.txt
```

The application runs at `http://localhost:5000` with Swagger documentation at `/api/docs`.

## Architecture

This is a Flask REST API for an electronic voting system using PostgreSQL and SQLAlchemy.

### Layer Structure

```
app/
├── models/        # SQLAlchemy ORM models with to_dict() serialization
├── services/      # Business logic layer (inherits from BaseService)
├── controllers/   # Flask blueprints handling HTTP requests
```

### Key Patterns

**Service Layer (LSP Pattern)**: All services inherit from `BaseService` (app/services/base_service.py) which defines abstract methods: `get_all()`, `get_by_id()`, `create()`. Each service implements these for its entity.

**Application Factory**: `create_app()` in app/__init__.py creates the Flask app, initializes extensions (SQLAlchemy, CORS, Swagger), and registers all blueprints.

**Configuration**: Uses environment-based config via `config/config.py` with `config_by_name` dict. Reads from `.env` file (DATABASE_URL, SECRET_KEY, FLASK_ENV).

### Data Model

Core entities: Elector (voters by DNI), Voto (votes), TipoVoto (vote types: valid/null/blank), PartidoPolitico (political parties), Candidato (candidates with optional numero_candidato), Categoria (electoral categories with ambito), VotoCategoria (vote details per category with preferential numbers).

### API Endpoints

All endpoints follow pattern `/api/<resource>/` for collection and `/api/<resource>/<id>` for individual items. Resources: electores, votos, tipos-voto, partidos, candidatos, categorias, votos-categoria.
