To use Cloud Kernel, you may want either to run a pre-built version or to compile it from source codes. Note that the default kernel configuration file is a customized version for Alibaba Cloud ECS instances, you might need to enable specific drivers and re-compile the kernel if you want to run it on non-ECS platforms.

### 2.1 Run with pre-built RPMs (recommended)

Installing from YUM source repo is the most recommended way:

- Step 1: Create a new YUM repo file:

```
sudo vim /etc/yum.repos.d/alinux-2.1903-plus.repo
```

- Step 2: Fill repository information into the repo file:

```
[plus]
name=Alibaba Cloud Linux 2.1903 Plus Software Collections
baseurl=http://mirrors.aliyun.com/alinux/2.1903/plus/x86_64/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/alinux/RPM-GPG-KEY-ALIYUN
```

- Step 3: Install the kernel:

```
sudo yum install -y kernel kernel-devel kernel-headers
```

- Step 4: Reboot system and enjoy Cloud Kernel.

### 2.2 Compile from source

- Step 1: Fetch kernel source:
  - Download from [Releases](https://github.com/alibaba/cloud-kernel/releases) page for a stable release and extract the source;
  - Or clone from the project repo: `git clone git@github.com:alibaba/cloud-kernel.git`.
- Step 2: Fetch a [default kernel config](https://github.com/alibaba/cloud-kernel/blob/configs/config-4.19.y-x86_64) from `configs` branch and rename it to `.config`, then copy it to the top of kernel source directory;
- Step 3: Compile and install kernel via the following commands:

```
make oldconfig
make -jN # N normally refers to the CPU core numbers on the system
make modules -jN
sudo make modules_install
sudo make install
```

- Step 4: Reboot system and enjoy Cloud Kernel.