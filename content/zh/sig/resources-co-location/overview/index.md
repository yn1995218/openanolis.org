---
title: 资源隔离技术SIG介绍
aliases: "/resource_co-location/docs/Home"
---



## 小组简介

内核资源隔离技术是阿里巴巴经济体的规模化混合部署方案所强依赖的关键技术，是历经多年“双十一”大考的重要落地技术。本兴趣组将围绕内核中的调度、内存和IO这三大主要子系统，将其中内核部分的特性实践开放出来，旨在加深云场景下大规模应用混合部署话题的思考与讨论。

除了传统的内核资源隔离技术，本兴趣小组还致力于云上的操作系统资源弹性的研究。

## 小组目标

通过社区合作，共同探讨操作系统资源隔离和资源弹性的技术方案，以实现云场景下大规模应用的混合或高密部署。

## 邮件列表与通信方式

邮件列表：[cloud-kernel@lists.openanolis.org](mailto:cloud-kernel@lists.openanolis.org)

IRC：[#anolis-linux](https://webchat.freenode.net/#anolis-linux)

## 成员列表

当前成员：

- 道引
- 晓郅
- 弃余
- 云煌
- 一斋
- 窅默
- 费曼



## 更多信息

- 官方网站：([https://OpenAnolis.org](https://openanolis.org/))
- 社区邮箱：([community@OpenAnolis.org](mailto:community@OpenAnolis.org))
- 贡献代码：(https://openanolis.org/community/main/contributing/)



## 正式进行的项目

### 1. 调度资源隔离

#### Group Identify

特性介绍：Group Identity特性是一种以cgroup组为单位实现调度特殊优先级的手段

特性价值：通过双rbtree的设计，实现了特定情况下优先调度一组任务的效果，并能够保障不会受到来自HT的低优先级任务干扰，确保了高优先级任务的性能表现

应用场景：Latency Sensitive + Best Effort混跑的业务场景。

### 2. 内存资源隔离

#### memcg 后台回收

特性介绍：在memcg维度实现异步内存回收功能

特性价值：在后台提前进行memcg内存的异步回收，避免应用自身陷入同步内存回收，从而使得业务提升了稳定性和性能。

应用场景：适用于对时延敏感的容器场景，如电商容器。

### 3. IO资源隔离

#### CGroup V1 Writeback

特性介绍：基于cgroup v1接口，实现per-cgroup的writeback，和blkio-throttle结合起来，可以实现脏页回刷限流。

特性价值：实现per-cgroup的buffered IO限流，避免造成IO瓶颈。

应用场景：业务上有优先级区分，需要共享磁盘带宽的场景。