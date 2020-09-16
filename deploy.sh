docker build -t ctl11/multi-client:latest -t ctl11/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t ctl11/multi-server:latest -t ctl11/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t ctl11/multi-worker:latest -t ctl11/multi-worker:$SHA -f ./worker/Dockerfile ./worker
#docker build -t ctl11/ctlserver:latest    -t ctl11/ctlserver:$SHA    -f ./ctlserver/Dockerfile ./ctlserver


docker push ctl11/multi-client:latest
docker push ctl11/multi-server:latest
docker push ctl11/multi-worker:latest
#docker push ctl11/ctlserver:latest

docker push ctl11/multi-client:$SHA
docker push ctl11/multi-server:$SHA
docker push ctl11/multi-worker:$SHA
#docker push ctl11/ctlserver:$SHA

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=ctl11/multi-server:$SHA
kubectl set image deployments/client-deployment client=ctl11/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=ctl11/multi-worker:$SHA
#kubectl set image deployments/ctlserver-deployment ctlserver=ctl11/ctlserver:$SHA