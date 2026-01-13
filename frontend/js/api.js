/**
 * Módulo de comunicación con el backend Flask
 */

const API_BASE_URL = 'http://localhost:5000/api';

const API = {
    /**
     * Realiza una petición fetch con reintentos
     */
    async fetchWithRetry(url, options = {}, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || `HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                if (i === retries - 1) throw error;
                // Esperar antes de reintentar (backoff exponencial)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    },

    /**
     * Obtiene todos los candidatos de una categoría específica
     */
    async getCandidatosPorCategoria(nombreCategoria) {
        try {
            // Primero obtener la categoría
            const categorias = await this.fetchWithRetry(`${API_BASE_URL}/categorias/`);
            const categoria = categorias.find(c =>
                c.nombre_categoria.toLowerCase().includes(nombreCategoria.toLowerCase())
            );

            if (!categoria) {
                throw new Error(`Categoría ${nombreCategoria} no encontrada`);
            }

            // Obtener todos los candidatos
            const candidatos = await this.fetchWithRetry(`${API_BASE_URL}/candidatos/`);

            // Filtrar por categoría
            const candidatosFiltrados = candidatos.filter(c =>
                c.id_categoria === categoria.id_categoria
            );

            // Obtener información de partidos para cada candidato
            const partidos = await this.fetchWithRetry(`${API_BASE_URL}/partidos/`);

            // Agrupar candidatos por partido
            const candidatosPorPartido = {};

            for (const candidato of candidatosFiltrados) {
                const partido = partidos.find(p => p.id_partido === candidato.id_partido);

                if (!candidatosPorPartido[candidato.id_partido]) {
                    candidatosPorPartido[candidato.id_partido] = {
                        partido: partido,
                        candidatos: []
                    };
                }

                candidatosPorPartido[candidato.id_partido].candidatos.push(candidato);
            }

            return {
                categoria: categoria,
                partidosConCandidatos: Object.values(candidatosPorPartido)
            };

        } catch (error) {
            console.error(`Error al obtener candidatos de ${nombreCategoria}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene todos los partidos políticos
     */
    async getPartidos() {
        return await this.fetchWithRetry(`${API_BASE_URL}/partidos/`);
    },

    /**
     * Obtiene todas las categorías
     */
    async getCategorias() {
        return await this.fetchWithRetry(`${API_BASE_URL}/categorias/`);
    },

    /**
     * Obtiene todos los tipos de voto
     */
    async getTiposVoto() {
        return await this.fetchWithRetry(`${API_BASE_URL}/tipos-voto/`);
    },

    /**
     * Crea un nuevo elector
     */
    async crearElector(dni, nombres, apellidos, distrito, region) {
        return await this.fetchWithRetry(`${API_BASE_URL}/electores/`, {
            method: 'POST',
            body: JSON.stringify({
                dni,
                nombres,
                apellidos,
                distrito,
                region
            })
        });
    },

    /**
     * Registra un voto completo con sus categorías
     */
    async registrarVoto(dni, votosPorCategoria) {
        try {
            // Determinar el tipo de voto basado en el estado de las categorías
            const tiposVoto = await this.getTiposVoto();
            const tipoValido = tiposVoto.find(t => t.nombre_tipo === 'Válido');

            if (!tipoValido) {
                throw new Error('No se encontró el tipo de voto "Válido"');
            }

            // Preparar los votos por categoría
            const votosCategoria = [];

            for (const voto of votosPorCategoria) {
                if (voto.estado === 'valido' && voto.id_partido) {
                    votosCategoria.push({
                        id_categoria: voto.id_categoria,
                        id_partido: voto.id_partido,
                        numero_preferencial_1: voto.candidatos_preferenciales?.[0] || null,
                        numero_preferencial_2: voto.candidatos_preferenciales?.[1] || null
                    });
                }
            }

            // Registrar el voto
            const voto = await this.fetchWithRetry(`${API_BASE_URL}/votos/`, {
                method: 'POST',
                body: JSON.stringify({
                    dni: dni,
                    id_tipo_voto: tipoValido.id_tipo_voto,
                    votos_categoria: votosCategoria
                })
            });

            return voto;

        } catch (error) {
            console.error('Error al registrar voto:', error);
            throw error;
        }
    },

    /**
     * Verifica la conexión con el servidor
     */
    async checkConnection() {
        try {
            await this.fetchWithRetry(`${API_BASE_URL}/categorias/`, {}, 1);
            return true;
        } catch (error) {
            return false;
        }
    }
};

// Exportar para uso en otros módulos
window.API = API;
