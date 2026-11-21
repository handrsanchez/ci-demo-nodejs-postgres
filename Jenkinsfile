pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        API_URL      = 'http://localhost:3000'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '>>> Clonando repositorio...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '>>> Construyendo imagen Docker de la API...'
                bat 'docker compose -f %COMPOSE_FILE% build --no-cache'
            }
        }

        stage('Deploy') {
            steps {
                echo '>>> Levantando contenedores (API + PostgreSQL)...'
                bat 'docker compose -f %COMPOSE_FILE% up -d'
                echo '>>> Esperando que los servicios esten listos...'
                bat 'ping -n 15 127.0.0.1 > nul'
            }
        }

        stage('Test') {
            steps {
                echo '>>> Verificando que la API responde correctamente...'
                bat '''
                    curl -f %API_URL%/ || exit 1
                    curl -f %API_URL%/status || exit 1
                '''
                echo '>>> API respondiendo correctamente. Pipeline exitoso.'
            }
        }
    }

    post {
        success {
            echo '✔ Pipeline completado exitosamente. Integracion continua operativa.'
        }
        failure {
            echo '✘ El pipeline fallo. Revisando logs...'
            bat 'docker compose -f %COMPOSE_FILE% logs --tail=50'
        }
        always {
            echo '>>> Deteniendo contenedores al finalizar el pipeline...'
            bat 'docker compose -f %COMPOSE_FILE% down'
        }
    }
}
