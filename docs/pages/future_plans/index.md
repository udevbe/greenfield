---
layout: default
title: Future Plans
nav_order: 6
has_children: false
---

# Linux Web Kernel

```mermaid
graph LR

subgraph Web Page
    subgraph WASM Shared Memory
        Linux_Kernel_Library_WASM
    end

    subgraph WebWorker A
        WASM_App_A-->|Linked With|Linux_Kernel_Library_WASM
    end

    subgraph WebWorker B
        WASM_App_B-->|Linked With|Linux_Kernel_Library_WASM
    end
end
```