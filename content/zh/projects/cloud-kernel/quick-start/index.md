### 快速运行指南

想要使用 Cloud Kernel，您既可以运行预编译的二进制内核包，也可以从源码编译内核。请注意我们提供的默认内核配置文件是为阿里云 ECS 实例定制的版本，如果您想要将内核运行于非 ECS 平台上，您需要自行打开相关的内核模块开关并且重新编译内核。

### 1 运行预编译二进制内核包(推荐)

首选方案是从 YUM 源安装：

- 第一步，新建一个 YUM 仓库文件：

```
sudo vim /etc/yum.repos.d/alinux-2.1903-plus.repo
```

- 第二步，填入 repo 信息：

```
[plus]
name=Alibaba Cloud Linux 2.1903 Plus Software Collections
baseurl=http://mirrors.aliyun.com/alinux/2.1903/plus/x86_64/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/alinux/RPM-GPG-KEY-ALIYUN
```

- 第三步，安装内核：

```
sudo yum install -y kernel kernel-devel kernel-headers
```

- 第四步，重启并使用 Cloud Kernel.

### 2 从源码编译内核

- 第一步，从以下两种途径之一获取 Cloud Kernel 源码：
  - 从 [Releases](https://github.com/alibaba/cloud-kernel/releases) 页面获取最新的稳定版内核代码压缩包，并解压到当前目录；
  - 或者从项目 Git 树 Clone 代码： `git clone git@github.com:alibaba/cloud-kernel.git`.
- 第二步，从 `configs` 分支获取[默认内核配置文件](https://github.com/alibaba/cloud-kernel/blob/configs/config-4.19.y-x86_64)，重命名为 `.config`, 并复制到源码树的顶层目录下；
- 第三步，通过下列命令编译并安装内核：

```
make oldconfig
make -jN # N normally refers to the CPU core numbers on the system
make modules -jN
sudo make modules_install
sudo make install
```

- 第四步，重启并使用 Cloud Kernel.

