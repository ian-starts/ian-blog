---
path: /deploying-elasticsearch-on-kubernetes
date: 2020-10-27T17:12:33.962Z
title: Deploying ElasticSearch on Kubernetes
keywords: Deploy,Kubernetes,ElasticSearch,Elastic,Search
topic: Devops
readTime: 3 min
author: Ian
featuredImage: ../../images/deploying-elasticsearch-on-kubernetes.png
authorImage: ../../images/authors/ian.jpg
ogImagePath: /posts/deploying-elasticsearch-on-kubernetes/images/og-image.png
description: "Get away from that AWS vendor lock-in, and run ElasticSearch yourself! This guide is centered around a great 
config for a scalable ElasticSearch deployment."
---
I'm a huge fan of Kubernetes. I'm also a huge fan of ElasticSearch. So I was a bit let down when the process of 
deploying wasn't very seamless. In this post I'll show you an easy and scalable Kubernetes config 
that works perfectly.

## Prerequisites
1. An up and running kubernetes cluster (see my guide [here](/setting-up-kubernetes-with-rancher-on-hetzner)).
2. Kubectl installed ([docs](https://kubernetes.io/docs/tasks/tools/install-kubectl/))
   
## The easy stuff
The first and easiest step is adding `ResourceDefinitions` to your cluster. This can be done with an awesome oneliner:
```bash
kubectl --kubeconfig KUBECONFIG_LOCATION apply -f https://download.elastic.co/downloads/eck/1.2.1/all-in-one.yaml
```

## The copy paste stuff
This is the config for running the ElasticSearch cluster on your Kube Cluster.
```yaml
# This sample sets up an Elasticsearch cluster with 2 nodes.
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: production-elasticsearch
spec:
  version: 7.7.1
  nodeSets:
    - name: default
      config:
        xpack.security.authc:
          anonymous:
            username: anonymous
            roles: superuser
            authz_exception: false
        # most Elasticsearch configuration parameters are possible to set, e.g: node.attr.attr_name: attr_value
        node.master: true
        node.data: true
        node.ingest: true
        node.store.allow_mmap: false
      podTemplate:
        metadata:
          labels:
            # additional labels for pods
            app: APP_NAME
            tier: elasticsearch
        spec:
          containers:
            - name: elasticsearch
              # specify resource limits and requests
              resources:
                limits:
                  memory: 0.7G
                  cpu: 0.2
                requests:
                  memory: 0.7G
                  cpu: 0.2
              env:
                - name: ES_JAVA_OPTS
                  value: "-Xms325m -Xmx325m"
      count: 2
  http:
    tls:
      selfSignedCertificate:
        disabled: true
```

Two important things to note:
1. ```yaml
    env:
        - name: ES_JAVA_OPTS
          value: "-Xms325m -Xmx325m" 
   ```

These values reference two things: `Xms` (Minimum Heap Size) and `Xmx` (Maximum Heap Size). The heap size refers to the 
JVM Heap Size, and by default ElasticSearch sets it to 1Gb. They should be the same size and when moving to production you need to set it 
to ***no more than 50% or your instance's RAM***.

2. ```yaml
   http:
       tls:
         selfSignedCertificate:
           disabled: true 
   ```

This is set to `false`, because my ElasticSearch cluster is running on a closed system (VPN) on kubernetes. Meaning than 
it's not reachable from the internet. This makes https useless, so I prefer the simplicity of http.

Save this config as `deploy-elastic.yaml` and run it using:

```bash
kubectl --kubeconfig KUBECONFIG_LOCATION apply -f deploy-elastic.yaml
```

## Connecting to Elastic
After the ElasticSearch cluster finished deploying you can easily connect to it with the following URL:
```bash
http://production-elasticsearch-es-http.default.svc.cluster.local:9200
```
Do note that this URL is only reachable when you are inside the kubernetes cluster. If you want to publicly expose your 
ElasticSearch cluster I highly recommend a different setup! One that uses HTTPS and has users setup.

You can reach it using an application that's already running in your cluster, or using a VPN.

## Scaling up
This config is not connected to an autoscaling group. If you want to scale your cluster to run more than two instances, you can simple change 
```yaml
count: 2
```
to a different integer.

## Some potentially problematic stuff
Kubernetes is mostly designed to run stateless containers. So running something like a database isn't really recommended. 
Some user do use ElasticSearch as a database, which is fine most of the time, especially when you run it on a dedicated VPS.
You should truly *not* do this when running ElasticSearch on Kubernetes. Treat your ElasticSearch cluster as an ephemeral index.

You should **always** be able to reconstruct the search index when necessary.   

For the people in the back:
**DO NOT USE ELASTICSEARCH AS A DATABASE.**

## Wrapping up
So with that out of the way, I hope you found this useful. I'm aware that there's also a very well documented [helm chart](https://github.com/elastic/helm-charts/tree/master/elasticsearch) available for ElasticSearch.
Do you want me to make a post on that? [Let me know!](https://iankok.com/contact) 
