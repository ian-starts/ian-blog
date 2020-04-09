---
path: /setting-up-kubernetes-with-rancher-on-hetzner
date: 2020-02-25T17:12:33.962Z
title: Setting up Kubernetes with Rancher on Hetzner
topic: Devops
readTime: 10 min
author: Ian
featuredImage: ../../images/kubectl-wheel.jpg
authorImage: ../../images/authors/ian.jpg
ogImagePath: /posts/kubernetes-hetzner/images/og-image.png
description: "This post will walk you through setting up a simple Kubernetes cluster on Hetzner Cloud with Rancher."
---
One of the big advantages of using Docker is the promise of an easy deployment process. And while this is definitely
 the case for smaller application with, for instance, [docker compose](), it's not really a production ready solution.
 Docker compose also doesn't have the (subjectively) very awesome autoscaling features and automatic rollbacks.
 Lots of organizations are choosing either a managed kubernetes solution by gcloud/Amazon, or choosing for a massive 
 vendor lock in with Amazon's ECS or Fargate. 

I'm going to show you a very easy way to launch your stack on kubernetes with a beautiful UI, and no vendor lock in 
using [Rancher](). And don't worry, it's a lot easier than you think!

In this tutorial we're just going to create a Kubernetes cluster with Rancher running on Hetzner servers, for a grand total of €5,- a month.
 No fancy stuff just yet. In another tutorial I'll show you how to run your services on the cluster, including a VPN and automatic SSL. 

I went with Hetzner because they offer very affordable servers at a prime location for european users. 
You also pay by the minute with Hetzner. So following along with this tutorial is going to cost you in the range of cents.

## Setting stuff up
Okay first off you're going to need a few things:

* [A hetzner account](https://accounts.hetzner.com/signUp)
* [ssh keys](https://www.digitalocean.com/docs/droplets/how-to/add-ssh-keys/create-with-openssh/)
* A new Hetzner project.
* Hetzner API Key (Sign in into the Hetzner Cloud Console choose a project, go to `Access` → `Tokens`, and create a new token.)

## Installing Rancher

1. Add SSH key 
    * Access → add ssh key
    ![ssh key screenshot](/posts/kubernetes-hetzner/images/create-ssh-key.png "Screenshot ssh key")
    * Use the following command to copy your ssh keys to clipboard: (it should end in something like "[user]@[machine]")
    ```shell script
    cat ~/.ssh/id_rsa.pub | pbcopy
   ```
   * Paste your clipboard into the text field and you're all set.
2. Add a server. (go to project → server → add server)
    * It doesn't really matter what kind of server. I'd recommend the smallest one in Falkenstein. 
    * Be sure to select the SSH key we just added 
    ![add ssh key to server](/posts/kubernetes-hetzner/images/add-ssh-key-to-server.png "Add ssh key to server")
3. SSH into your newly created server (you can find the IP address in the server tab of the Hetzner console):
      ```shell script
    ssh root@[IP_ADDRESS]
    ```
4. Setup Docker on your remote host. 
    ```shell script
    sudo apt-get update
    ```
   ```shell script
   sudo apt-get install \
       apt-transport-https \
       ca-certificates \
       curl \
       gnupg-agent \
       software-properties-common
   ```
   ```shell script
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   ```
   ```shell script
   sudo add-apt-repository \
      "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) \
      stable"
   ```
   ```shell script
   sudo apt-get update
   ```
   ```shell script
    sudo apt-get install docker-ce docker-ce-cli containerd.io
    ```
5. Run the Rancher image!
    ```shell script
    sudo docker run -d --restart=unless-stopped -p 80:80 -p 443:443 rancher/rancher
    ```
6. You can do two things right now:
    1. Setup a domain and point it to your server IP or,
    2. Just continue with your server IP and don't bother with a domain.
    
    I would recommend setting up a domain if you're planning on running a production build based on this tutorial. 
    Mainly because using a domain enables SSL on your Rancher WebUI.
    If you want to get through this tutorial and go for production later: just use the IP and figure out the domain 
    once you're doing production level stuff.  
7. Go to [https://[YOUR-SERVER-IP OR YOUR-DOMAIN]]([https://[YOUR_SERVER_IP OR YOUR_DOMAIN]]) and set a strong admin Password. 
It will start bitching about SSL if you use the IP. Just accept or setup a domain. Whatever, there are no rules.

## Setting up Rancher to be able to provision Hetzner nodes
1. In Rancher go to `Tools` → `Drivers` → `Add Node Driver`
    
    | Key        | Value |
    | ------------- |-------------|
    | Download URL   | ```https://github.com/JonasProgrammer/docker-machine-driver-hetzner/releases/download/2.0.1/docker-machine-driver-hetzner_2.0.1_linux_amd64.tar.gz``` |
    |Custom UI URL      | ```https://storage.googleapis.com/hcloud-rancher-v2-ui-driver/component.js``` |
    | Whitelist Domains|```storage.googleapis.com```  |
    
2. Go to `Clusters` → `Add Cluster` in Rancher and you should see Hetzner as an infrastructure supplier.
3. This should prompt the `Add Cluster` screen
    ![Create Cluster](/posts/kubernetes-hetzner/images/rancher-create-cluster.png "Create Cluster")
4. Click on `Add Node Template` and enter the API Token we created in the 'setting stuff up' step
5. Create a template and name it by the type of instance you choose.
    ![Create Node Template](/posts/kubernetes-hetzner/images/create-node-template.png "Create Node Template")
6. Enter a cluster name, select `etcd`, `Control Pane` and `Worker` for your node and press create
    * It's not recommended to have one node manage the etcd, control pane and be a worker. This is because if you 
     overload the cluster, the node will fail and the cluster will go down. It's better to separate the etcd + control pane 
     from the worker.


![Create Cluster](/posts/kubernetes-hetzner/images/create-cluster.png "Create Node Template")
 

Awww yisss! You've just created a fully operational Kubernetes cluster on Rancher!🚀 You can manually scale instances 
up and down. 

If you're already familliar with Kubernetes, you can find the `.kube/config` file under `Cluster` → `Kubeconfig`. 

If you're not: don't worry! We're going to walk you through setting up some extra cool features (like a VPN) and
 launching your first application on the cluster later.
 