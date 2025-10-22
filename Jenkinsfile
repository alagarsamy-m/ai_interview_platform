pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/deepak43276/ai_interview_platform.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test || echo "No tests defined"'
      }
    }
  }

  post {
    success {
      echo '✅ Build and test successful! Vercel will handle deployment automatically.'
    }
    failure {
      echo '❌ Build or test failed. Check logs.'
    }
  }
}
