---
title: "Introduce to bcc"
---

### 我们为什么需要 bcc ？

BCC (BPF Compiler Collection) 是基于 Linux eBPF 特性的内核跟踪及调试工具。

说起内核的调试，缺少经验的新同学经常会感到无所适从。时至今日，Linux 的代码量已经达到千万级别，整个内核就像是一个巨大的黑盒，想要窥探黑盒中的秘密，往往需要采取一些特殊手段。除了 trace 神技——打印以外，内核其实提供了多种框架来实现内核的跟踪调试，例如 ftrace、systemtap 等。



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/129366/1596435413055-c7dfbc53-3d60-49ba-91c5-6351ed2ec89e.jpeg)



既然在 bcc 之前我们已经有了多种选择，那么为什么还需要 bcc 呢？因为性能与效率。在展开解释之前，其实有必要简单介绍一下这些框架的数据来源。其实之前提及的 ftrace、systemtap 等都是一种框架，一种将内核中的信息搬运到用户态的机制，而这些内核信息的来源则是 tracepoint、kprobe、uprobe 等机制。大家可以简单地将这些机制理解为代码中的一个个“桩”，这些桩可能打在函数的起始位置（kprobe）、函数中间的地方（tracepoint）、或者是函数的尾部（kretprobe）。CPU 执行逻辑的时候，每碰到一个“桩”，就会产生一条信息，这条信息可以包含用户感兴趣的信息，例如当前执行的函数传入的参数等等。

这里一个非常关键的点是，每碰到一个“桩”，就产生一条信息，而 blktrace、ftrace 这些框架只是将这一条条的信息从内核态搬运到用户态；如果用户调试过程中插入的“桩”过多，或者对热点函数插“桩”，那么短时间内就会产生大量的数据，将这些数据从内核态搬运到用户态，会对系统 CPU 和 IO 产生相当大的压力，这也是为什么 blktrace、ftrace 这些工具只是在出现问题的时候用一下，而不会常态化部署的原因。

systemtap 相较于 blktrace/ftrace 的一大优势就是，systemtap 可以在内核态对 raw data 进行处理，最后呈现给用户态的是一份已经处理过的“简报”而不是原始数据。此外 blktrace/ftrace 能够获取的数据格式是内核已经预定义的，例如从 kprobe 获取的数据只有函数的所有参数，而 systemtap 除此之外还能获取其他信息，例如当前的时间、所在的 CPU 等。所以说 systemtap 会更加高效和灵活，但是代价是安全性。systemtap 本质上是一个内核模块，systemtap 框架可以将用户编写的一段脚本编译成一个内核模块，一个由用户自己编写的 out-of-tree 的内核模块在内核中裸奔，先天就存在安全缺陷。

铺垫了这么久，终于介绍到 bcc 了。正如文章开头介绍的那样，提到 bcc，就不得不提 eBPF。eBPF 的详细介绍可以参考 [eBPF Internal: Instructions and Runtime](https://kernel.taobao.org/2020/06/eBPF-Internal-Instructions-and-Runtime/)。简单地说，eBPF 机制在内核内部实现了一个虚拟机，用户可以在用户态注入一段代码，这段代码可以在内核态的虚拟机中以一种安全、受监督的方式执行。bcc 正是利用了 eBPF 的这一特性，使得用户编写的调试程序得以在内核态中运行。与 systemtap 类似，bcc 也是在内核态对 raw data 进行处理后，再输出给用户态。但是由于 eBPF 框架下用户编写的程序是在虚拟机中运行的，因而其安全性可以得到保证。

当然，相比于内核的原生代码，例如内核组自研的各种监控补丁，bcc 肯定具有一定的性能损耗，性能损耗的幅度视监控需要完成的工作以及系统负载而定，例如援引 Facebook 的数据，对内核调度系统的监控会带来“2% cpu regression. Higher softirq times. Slower user apps” 的性能损耗；我们自己实测，在通常的工作场景下存在 3～10% 的性能损耗，在高压力压测场景下存在 20% 的性能损耗。但是将跟踪调试的代码直接插入到内核代码中，侵入性非常大，代码维护难度、开发成本都会上升；同时每次面对新需求都需要重新编译、发布版本，灵活度在所有调试手段中是最低的。

因而总的来说，作为一种跟踪调试的手段，bcc 在开发效率、执行性能、安全性这几个方面达到了平衡，个人认为是目前最优的跟踪调试手段。如果业务侧对系统性能没有过于严苛的要求，bcc 也可以作为常态化监控部署。

当然需要注意的是，eBPF 特性在内核 4.4 版本开始合入，在 4.9 版本趋于稳定，因而推荐在 4.9 及以上版本使用 bcc。



### bcc 社区介绍



bcc 是 Linux 基金会下的 IO Visor 项目的一个开源项目，主要开发工作在 [github](https://github.com/iovisor/bcc) 中进行。

bcc 的全名是 "BPF Compiler Collection"，顾名思义，bcc 在本质上是一个编译器，将用户编写的 C 程序或 python/lua  脚本编译为一个内核模块，从而用于内核跟踪调试。此外在此基础上，bcc 社区本身已经实现了一系列的工具，涵盖内核的所有子系统。目前社区已经实现了超过一百个小工具。



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/129366/1596442744466-48c93eaa-7bf5-4aaf-bfac-31f260ba3e67.png)



### bcc 在工业界使用

随着 eBPF 的大热，工业界越来越多的公司正开始使用 eBPF。

Facebook 已经在生产环境实现常态化部署 eBPF 程序用于系统监控，[BPF at Facebook](https://www.slideshare.net/ennael/kernel-recipes-2019-bpf-at-facebook)



> - ~40 BPF programs active on every server.
>
> - ~100 BPF programs loaded on demand for short period of time.
>
> - Mainly used by daemons that run on every server.



网易也有在生产环境中使用 bcc。[eBPF在网易轻舟云原生的应用实践](https://mp.weixin.qq.com/s/KSUeLH6rBAiUnrDEexIiqw)

### bcc 在 ECS 中使用

目前用户可以在 Alibaba Cloud Linux (alinux2) 中通过 yum 直接安装使用 bcc 工具。

```
yum install bcc-tools
```

此外我们还对 bcc 工具集进行了增强，部分是对社区原有工具的增强，部分是自研工具。

bcc 的使用非常简单，在安装 rpm 包之后，一个工具对应一个 python 脚本，直接运行 python 脚本即可。以下举例介绍 bcc 工具的使用方法与应用实例。

#### memleak

memleak 是 bcc 社区原生提供的一个工具，其本质上是追踪 memleak 工具执行过程的内存分配与释放操作，输出打印超过一段时间阈值后仍未释放的内存，其输出效果如下所示：

```
# ./memleak
Attaching to kernel allocators, Ctrl+C to quit.
[15:47:26] Top 10 stacks with outstanding allocations:
        80 bytes in 10 allocations from stack
                __kmalloc_node+0x14b [kernel]
                __vmalloc_node_range+0xdd [kernel]
        640 bytes in 10 allocations from stack
                kmem_cache_alloc_node_trace+0x123 [kernel]
                __get_vm_area_node+0x7a [kernel]
        928 bytes in 18 allocations from stack
                __kmalloc+0x130 [kernel]
```

