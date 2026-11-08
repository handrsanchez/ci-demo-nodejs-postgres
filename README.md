# Demo Integracion Continua - GitHub + Docker

Proyecto de demostracion para el primer entregable (Semana 3) del modulo de Enfasis Profesional I (Integracion Continua), Politecnico Grancolombiano.

Contiene dos contenedores Docker comunicados entre si mediante una red bridge personalizada (`ci_network`):

- **api**: servicio Node.js/Express (contenedor `ci_demo_api`) que expone los endpoints `/` y `/status`.
- **db**: servicio PostgreSQL (contenedor `ci_demo_db`) que almacena los registros insertados por la API.

## Como ejecutarlo

```bash
docker compose up -d --build
docker ps
curl http://localhost:3000/status
```
