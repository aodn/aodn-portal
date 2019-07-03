pipeline {
    agent none

    stages {
        stage('clean') {
            agent { label 'master' }
            steps {
                sh 'git clean -fdx'
            }
        }
        stage('container') {
            agent {
                dockerfile {
                    args '-v ${HOME}/.m2:/home/builder/.m2 -v ${HOME}/.grails:/home/builder/.grails'
                    additionalBuildArgs '--build-arg BUILDER_UID=${JENKINS_UID:-9999}'
                }
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
                    archiveArtifacts artifacts: 'target/*.war', fingerprint: true, onlyIfSuccessful: true
                }
            }
        }
    }
}
