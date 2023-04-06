pipeline {
	agent none

	environment {
		DOCKER_IMAGE = "jette338/travel-care-api"
	}

	stages {
		stage("build") {
			agent { node {label 'master'}}
				environment {
					DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
				}
			steps {
				withCredentials([file(credentialsId: 'env', variable: 'secretFile')]) {
					sh "cp $secretFile $WORKSPACE"
				}
				sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} . "
				sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
				sh "docker image ls | grep ${DOCKER_IMAGE}"
				withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
					sh 'echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin'
					sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
					sh "docker push ${DOCKER_IMAGE}:latest"
				}

				//clean to save disk
				sh "docker image rm ${DOCKER_IMAGE}:${DOCKER_TAG}"
				sh "docker image rm ${DOCKER_IMAGE}:latest"
			}
		}

		stage("deploy") {
			when {
				anyOf {
					branch 'main'
					branch 'develop'
				}
			}
			agent { node {label 'master'}}
			steps {
				sshagent(['ssh-remote']) {
					sh "ssh -o StrictHostKeyChecking=no -l root 159.223.54.69 rm -rf /root/project/*"
					sh "ssh -o StrictHostKeyChecking=no -l root 159.223.54.69 cp -R /var/lib/docker/volumes/jenkins_home/_data/workspace/nestjs/* /root/project"
					sh "ssh -o StrictHostKeyChecking=no -l root 159.223.54.69 cd /root/project/ && docker-compose stop && docker-compose rm -f && docker-compose pull && docker-compose up -d" 
				}
			}
		}
	}

	post {
		success {
			echo "SUCCESSFUL"
		}
		failure {
			echo "FAILED"
		}
	} 
}