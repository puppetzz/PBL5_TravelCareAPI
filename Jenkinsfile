pipeline {
	agent none

	environment {
		DOCKER_IMAGE = "jette338/travel-care-api"
	}

	stages {
		stage("build") {
			when {
				not {
					anyOf {
						branch 'main'
						branch 'develop'	
					}
				}
			}
			agent { node {label 'master'}}
				environment {
					DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
				}
			steps {
				sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} . "
				sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
				sh "docker image ls | grep ${DOCKER_IMAGE}"

				//clean to save disk
				sh "docker image rm ${DOCKER_IMAGE}:${DOCKER_TAG}"
				sh "docker image rm ${DOCKER_IMAGE}:latest"
			}
		}

		stage("build and push image to docker hub") {
			when {
				anyOf {
					branch 'main'
					branch 'develop'
				}
			}
			agent { node {label 'master'}}
				environment {
					DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
				}
			steps {
				withCredentials([file(credentialsId: 'env', variable: 'secretFile')]) {
					sh "cp $secretFile $WORKSPACE"
				}
				withCredentials([file(credentialsId: 'docker-env', variable: 'secretFile')]) {
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

		stage("deploy main") {
			when {
				anyOf {
					branch 'main'
				}
			}
			agent { node {label 'master'}}
			steps {
				withCredentials([file(credentialsId: 'env', variable: 'secretFile')]) {
					sh "cp $secretFile $WORKSPACE"
				}
				withCredentials([file(credentialsId: 'docker-env', variable: 'secretFile')]) {
					sh "cp $secretFile $WORKSPACE"
				}
				withCredentials([file(credentialsId: 'docker-compose', variable: 'secretFile')]) {
					sh "cp $secretFile $WORKSPACE"
				}
				sshagent(['ssh-remote']) {
					sh "ssh -o StrictHostKeyChecking=no -l root 68.183.182.107 rm -rf /root/project/*"
					sh "ssh -o StrictHostKeyChecking=no -l root 68.183.182.107 cp -R /var/lib/docker/volumes/jenkins_home/_data/workspace/travel-care-api_main/* /root/project"
					sh "ssh -o StrictHostKeyChecking=no -l root 68.183.182.107 cd /root/project/ && docker-compose stop" 
					sh "ssh -o StrictHostKeyChecking=no -l root 68.183.182.107 cd /root/project/ && docker-compose rm -f" 
					sh "ssh -o StrictHostKeyChecking=no -l root 68.183.182.107 cd /root/project/ && docker-compose pull api" 
					sh "ssh -o StrictHostKeyChecking=no -l root 68.183.182.107 cd /root/project/ && docker-compose up -d" 
				}
			}
		}
		stage("deploy develop") {
			when {
				anyOf {
					branch 'develop'
				}
			}
			agent { node {label 'master'}}
			steps {
				withCredentials([file(credentialsId: 'env', variable: 'secretFile')]) {
					sh "cp $secretFile $WORKSPACE"
				}
				withCredentials([file(credentialsId: 'docker-env', variable: 'secretFile')]) {
					sh "cp $secretFile $WORKSPACE"
				}
				withCredentials([file(credentialsId: 'docker-compose', variable: 'secretFile')]) {
					sh "cp $secretFile $WORKSPACE"
				}
				sshagent(['ssh-remote']) {
					sh "ssh -o StrictHostKeyChecking=no -l root 188.166.241.152 rm -rf /root/project/*"
					sh "ssh -o StrictHostKeyChecking=no -l root 188.166.241.152 cp -R /var/lib/docker/volumes/jenkins_home/_data/workspace/travel-care-api_develop/* /root/project"
					sh "ssh -o StrictHostKeyChecking=no -l root 188.166.241.152 cd /root/project/ && docker-compose stop" 
					sh "ssh -o StrictHostKeyChecking=no -l root 188.166.241.152 cd /root/project/ && docker-compose rm -f" 
					sh "ssh -o StrictHostKeyChecking=no -l root 188.166.241.152 cd /root/project/ && docker-compose pull" 
					sh "ssh -o StrictHostKeyChecking=no -l root 188.166.241.152 cd /root/project/ && docker-compose up -d" 
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