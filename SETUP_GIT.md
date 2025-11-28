# Git 连接设置指南

✅ **第一步已完成：** Git 仓库已初始化并创建了初始提交

## 接下来的步骤

### 步骤 1：在 GitHub 创建仓库

1. **访问 GitHub**
   - 打开 https://github.com/new
   - 如果没有账号，先注册（免费）

2. **创建新仓库**
   - Repository name: `math-practice`（或任意名称）
   - Description: `小学生加减法练习 App`
   - 选择 **Public**（GitHub Pages 需要公开仓库）
   - **不要**勾选 "Initialize this repository with a README"（我们已经有了）
   - 点击 **Create repository**

### 步骤 2：连接本地仓库到 GitHub

复制 GitHub 显示的仓库地址（HTTPS），然后运行：

```bash
cd /Users/haihuang.hh/Documents/code/math_practice

# 添加远程仓库（替换成你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/你的用户名/math-practice.git

# 推送代码
git push -u origin main
```

**示例：**
如果你的 GitHub 用户名是 `zhangsan`，仓库名是 `math-practice`，则运行：
```bash
git remote add origin https://github.com/zhangsan/math-practice.git
git push -u origin main
```

### 步骤 3：在 Netlify 连接 Git 仓库

1. **登录 Netlify**
   - 访问 https://app.netlify.com
   - 登录你的账号

2. **进入你的网站**
   - 在网站列表中找到你的 `math-practice` 网站
   - 点击进入

3. **连接 Git 仓库**
   - 点击 **Site settings**（网站设置）
   - 在左侧菜单找到 **Build & deploy**
   - 点击 **Continuous Deployment**
   - 点击 **Link repository**（连接仓库）
   - 选择 **GitHub**（或 GitLab/Bitbucket）
   - 授权 Netlify 访问你的 GitHub
   - 选择你的 `math-practice` 仓库

4. **配置构建设置**
   - Build command: **留空**（静态网站不需要构建）
   - Publish directory: **`.`**（当前目录，就是一个点）
   - 点击 **Deploy site**（部署网站）

5. **完成！**
   - Netlify 会自动部署你的网站
   - 以后每次 `git push`，Netlify 都会自动更新网站

## 以后更新代码

设置完成后，以后更新代码只需要：

```bash
cd /Users/haihuang.hh/Documents/code/math_practice

# 修改代码后
git add .
git commit -m "更新：描述你的更改"
git push origin main

# Netlify 会自动检测并部署！
```

或者直接运行更新脚本：

```bash
./update.sh
```

## 验证设置

设置完成后，可以测试一下：

1. 修改 `index.html` 中的某个文字
2. 运行 `git add . && git commit -m "测试更新" && git push origin main`
3. 等待 1-2 分钟
4. 访问你的 Netlify 网站，应该能看到更新

## 常见问题

### Q: 推送时要求输入用户名密码？
A: GitHub 现在不支持密码，需要使用 Personal Access Token：
   - 访问 https://github.com/settings/tokens
   - 生成新 token（选择 repo 权限）
   - 推送时用户名用你的 GitHub 用户名，密码用 token

### Q: 如何查看 Git 远程仓库？
A: 运行 `git remote -v` 查看

### Q: Netlify 没有自动部署？
A: 
   - 检查 Netlify 是否成功连接了 Git 仓库
   - 检查 GitHub 仓库是否是 Public
   - 查看 Netlify 的 Deploys 页面是否有错误

## 需要帮助？

如果遇到问题，可以：
1. 查看 `UPDATE.md` 文件中的详细说明
2. 检查 Netlify 的 Deploys 页面查看错误日志
3. 运行 `git status` 查看当前状态

