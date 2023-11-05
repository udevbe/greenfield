---
layout: default
title: Future Plans
nav_order: 5
has_children: false
---

# Web Kernel

```mermaid
graph

subgraph Page: http://foo.com
    subgraph WASM Shared Memory
        subgraph Linux Kernel Library
            LklW(Linux Kernel Library WASM Module)-->|implements|LklWVIO(Linux Kernel Library VirtIO Web Drivers)
        end
    end

    subgraph Worker: http://foo.com/app_a
        AppA(WASM App A)-->|Links With|LklW
    end

    subgraph Worker: http://foo.com/app_b
        AppB(WASM App B)-->|Links With|LklW
    end

    WebAPI(Web API)<-->|interacts with|LklWVIO
end
```

# Web File System

```mermaid
graph LR

subgraph JuiceFS Server
    ds(Object Storage - PostgreSQL)
    Mds(Metadata Engine - ElectricSQL)
end

subgraph Web App
    AppA(WASM App)<-->|local 0ms|MdsC(Metadata Engine Cache - ElectricSQL)
    AppA(WASM App)<-->|remote 50ms|ds

    MdsC<-->|sync 50ms|Mds
end

subgraph Remote App
    AppB(Remote App)<-->|local 0ms|MdsCA(Metadata Engine Cache - ElectricSQL)
    AppB(Remote App)<-->|remote 50ms|ds

    MdsCA<-->|sync 50ms|Mds
end
```
