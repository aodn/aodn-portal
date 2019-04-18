pipeline {
    agent {
        dockerfile {
            args '-v ${HOME}/.m2:/var/maven/.m2'
        }
    }
    environment {
        JAVA_TOOL_OPTIONS = '-Duser.home=/var/maven'
    }
    stages {
        stage('test') {
            steps {
                sh 'mvn -B clean test'
            }
        }
        stage('package') {
            steps {
                sh 'grails -DARTIFACT_BUILD_NUMBER=${BUILD_NUMBER} -Dgrails.work.dir=${WORKSPACE}/target clean --non-interactive --plain-output'
                sh 'grails -DARTIFACT_BUILD_NUMBER=${BUILD_NUMBER} -Dgrails.work.dir=${WORKSPACE}/target war --non-interactive --plain-output'
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'target/*.war,target/*.war.md5', fingerprint: true, onlyIfSuccessful: true
        }
    }
}

