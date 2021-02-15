# Some useful commands, in order:

Create a new cluster
```
gcloud container clusters create test-cluster \
  --release-channel rapid \
  --num-nodes=1 \
  --machine-type=n1-standard-1
```

Add a gpu node pool to the cluster
```
gcloud container node-pools create gpu-pool \
  --num-nodes=1 \
  --accelerator type=nvidia-tesla-t4,count=1 \
  --cluster=test-cluster \
  --machine-type=n1-standard-4 \
  --enable-autoscaling \
  --preemptible \
  --min-nodes=1 --max-nodes=1 \
  --node-taints gpu=true:NoSchedule
```

Install a gpu driver daemon set
```
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/master/nvidia-driver-installer/cos/daemonset-preloaded.yaml
```

Install a gpu sharing daemon set
```
kubectl apply -f gpu-sharing-daemonset.yaml
```

Install the app-endpoint-server deployment
```
kubectl apply -f app-endpoint-deployment.yaml
```

Install load balancer backend config used by the app-endpoint service
```
kubectl apply -f app-endpoint-backend-config.yaml
```

Install the app-endpoint-server service to make the deployment visible to the node
```
kubectl apply -f app-endpoint-service.yaml
```

Install the app-endpoint-ingress to make the service publicly visible
```
kubectl apply -f app-endpoint-ingress.yaml
```

More info (ie. for static ip): https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer
