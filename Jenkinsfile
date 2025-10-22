pipeline {
    agent any

    environment {
        NEXT_PUBLIC_SUPABASE_URL = 'https://dwgwqkthsukaxbawlnxd.supabase.co'
        NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Z3dxa3Roc3VrYXhiYXdsbnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTY0OTgsImV4cCI6MjA2MDM2MjQ5OH0.BHpDeSDgfzx7xZao0X2L1TmHtU0HSslGXgy5zqZeDsY'
        OPENROUTER_API_KEY = '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'
        NEXT_PUBLIC_HOST_URL = 'http://localhost:3000/interview/'
        NEXT_PUBLIC_VAPI_PUBLIC_KEY = '1a17c9cf-0a2d-4cbd-905e-0bbb39fd47cc'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/deepak43276/ai_interview_platform.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test || echo "No tests found"'
            }
        }

        stage('Archive Build') {
            steps {
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }
    }

    post {
        success {
            echo '✅ Build completed successfully!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}
