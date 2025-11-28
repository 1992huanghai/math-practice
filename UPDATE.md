# Netlify 更新代码指南

## 方法一：通过 Git 自动部署（推荐）✨

如果你已经将代码推送到 GitHub/GitLab/Bitbucket，这是最方便的方式：

### 首次设置（如果还没连接 Git）

1. **推送代码到 GitHub**
   ```bash
   cd /Users/haihuang.hh/Documents/code/math_practice
   
   # 如果还没有初始化 Git
   git init
   git add .
   git commit -m "Initial commit"
   
   # 在 GitHub 上创建新仓库后
   git remote add origin https://github.com/你的用户名/math-practice.git
   git branch -M main
   git push -u origin main
   ```

2. **在 Netlify 连接 Git**
   - 登录 https://app.netlify.com
   - 进入你的网站
   - 点击 **Site settings** → **Build & deploy** → **Continuous Deployment**
   - 点击 **Link repository**
   - 选择 GitHub/GitLab/Bitbucket，授权并选择你的仓库
   - Build command 留空，Publish directory 填写：`.`（当前目录）
   - 点击 **Deploy site**

### 以后更新代码

只需要推送代码到 Git，Netlify 会自动部署：

```bash
cd /Users/haihuang.hh/Documents/code/math_practice

# 修改代码后
git add .
git commit -m "更新描述"
git push origin main

# Netlify 会自动检测到更新并部署！
```

**优点：**
- ✅ 自动部署，无需手动操作
- ✅ 可以查看部署历史
- ✅ 可以回滚到之前的版本
- ✅ 可以设置部署预览（Pull Request）

---

## 方法二：手动拖拽更新（如果使用拖拽部署）

如果你最初是通过拖拽文件夹部署的：

1. **修改代码**
   - 在本地修改 `index.html`、`style.css` 或 `script.js`

2. **重新部署**
   - 登录 https://app.netlify.com
   - 进入你的网站
   - 点击 **Deploys** 标签页
   - 将修改后的 `math_practice` 文件夹拖拽到页面
   - 等待部署完成

**缺点：**
- ❌ 每次都要手动操作
- ❌ 没有版本历史
- ❌ 无法回滚

**建议：** 改用方法一（连接 Git），以后更新更方便！

---

## 方法三：通过 Netlify CLI（命令行）

适合喜欢用命令行的开发者：

### 安装 Netlify CLI

```bash
npm install -g netlify-cli
```

### 登录

```bash
netlify login
```

### 部署

```bash
cd /Users/haihuang.hh/Documents/code/math_practice

# 首次部署（会提示连接站点）
netlify deploy --prod

# 以后更新
netlify deploy --prod
```

---

## 推荐工作流程

### 最佳实践：Git + Netlify 自动部署

1. **初始化 Git 仓库**（如果还没有）
   ```bash
   cd /Users/haihuang.hh/Documents/code/math_practice
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub**
   ```bash
   # 在 GitHub 创建仓库后
   git remote add origin https://github.com/你的用户名/math-practice.git
   git branch -M main
   git push -u origin main
   ```

3. **在 Netlify 连接 Git 仓库**
   - Site settings → Build & deploy → Link repository

4. **以后更新代码**
   ```bash
   # 修改代码
   # ...
   
   # 提交并推送
   git add .
   git commit -m "更新：添加新功能"
   git push origin main
   
   # Netlify 自动部署完成！
   ```

---

## 查看部署状态

在 Netlify 控制台：
- **Deploys** 标签页：查看所有部署历史
- **Site overview**：查看当前部署状态
- 每个部署都有唯一 URL，可以访问预览

---

## 回滚到之前的版本

如果新版本有问题，可以快速回滚：

1. 进入 Netlify 控制台
2. 点击 **Deploys** 标签页
3. 找到之前的版本
4. 点击 **...** → **Publish deploy**

---

## 常见问题

### Q: 更新后网站没有变化？
A: 
- 检查浏览器缓存（Ctrl+F5 强制刷新）
- 检查 Netlify 部署是否成功
- 检查文件路径是否正确

### Q: 如何查看部署日志？
A: 在 Netlify 的 Deploys 页面，点击任意部署即可查看详细日志

### Q: 可以设置自动部署吗？
A: 连接 Git 后，默认就是自动部署。每次 push 代码都会自动触发部署。

---

## 快速更新脚本

创建一个简单的更新脚本：

```bash
#!/bin/bash
# update.sh

cd /Users/haihuang.hh/Documents/code/math_practice

echo "📝 提交更改..."
git add .
git commit -m "更新: $(date '+%Y-%m-%d %H:%M:%S')"

echo "📤 推送到 GitHub..."
git push origin main

echo "✅ 代码已推送！Netlify 将自动部署..."
echo "🌐 查看部署状态: https://app.netlify.com"
```

使用方法：
```bash
chmod +x update.sh
./update.sh
```

