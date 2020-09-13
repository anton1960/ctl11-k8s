#!/usr/bin/env bash

IMAGES=( client server worker )
CONTAINER_PREFIX=eu.gcr.io/docker-kubernetes-237606/jsdevtom/multi-
GIT_SHA=$(git rev-parse HEAD)

for i in ${IMAGES[@]}
do
	docker build \
	    -t ${CONTAINER_PREFIX}${i}:latest \
	    -t ${CONTAINER_PREFIX}${i}:${GIT_SHA} \
	    -f ./${i}/Dockerfile ./${i}
    docker push ${CONTAINER_PREFIX}${i}:latest
    docker push ${CONTAINER_PREFIX}${i}:${GIT_SHA}
done

kubectl apply -f k8s

for i in ${IMAGES[@]}
do
    kubectl set image \
    deployment/${i}-deployment \
    ${i}=${CONTAINER_PREFIX}${i}:${GIT_SHA}
done


