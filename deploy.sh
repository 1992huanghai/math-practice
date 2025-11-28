#!/bin/bash

# 快速部署脚本
# 帮助将应用部署到 GitHub Pages

echo "🚀 开始部署到 GitHub Pages..."
echo ""

# 检查是否已初始化 Git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: Math Practice App"
    echo "✅ Git 仓库已初始化"
    echo ""
fi

# 检查是否有远程仓库
if ! git remote | grep -q "origin"; then
    echo "⚠️  未检测到远程仓库"
    echo ""
    echo "请先在 GitHub 上创建仓库，然后运行："
    echo "  git remote add origin https://github.com/你的用户名/仓库名.git"
    echo "  git branch -M main"
    echo "  git push -u origin main"
    echo ""
    echo "然后在 GitHub 仓库设置中启用 Pages："
    echo "  Settings → Pages → Source: main branch → / (root)"
    echo ""
else
    echo "📤 推送代码到 GitHub..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有更改需要提交"
    git push origin main || git push origin master
    echo ""
    echo "✅ 代码已推送！"
    echo ""
    echo "📝 下一步："
    echo "1. 访问你的 GitHub 仓库"
    echo "2. 进入 Settings → Pages"
    echo "3. Source 选择：Deploy from a branch"
    echo "4. Branch 选择：main，文件夹选择：/ (root)"
    echo "5. 点击 Save"
    echo ""
    echo "几分钟后，你的网站将在以下地址可用："
    echo "  https://你的用户名.github.io/仓库名"
fi

