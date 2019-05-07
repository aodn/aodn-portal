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
                    args '-v ${HOME}/.m2:/home/jenkins/.m2 -v ${HOME}/.grails:/home/jenkins/.grails'
                }
            }
            environment {
                HOME = '/home/jenkins'
                JAVA_TOOL_OPTIONS = '-Duser.home=/home/jenkins'
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
    }
}
