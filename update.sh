#!/bin/bash

# Netlify 更新脚本
# 使用方法：./update.sh

cd /Users/haihuang.hh/Documents/code/math_practice

echo "🚀 开始更新 Netlify 部署..."
echo ""

# 检查是否有 Git 仓库
if [ ! -d ".git" ]; then
    echo "⚠️  未检测到 Git 仓库"
    echo ""
    echo "请选择更新方式："
    echo ""
    echo "方式一：连接 Git 自动部署（推荐）"
    echo "  1. 初始化 Git: git init"
    echo "  2. 推送到 GitHub: git remote add origin ..."
    echo "  3. 在 Netlify 连接 Git 仓库"
    echo "  4. 以后只需 git push 即可自动部署"
    echo ""
    echo "方式二：手动拖拽更新"
    echo "  1. 修改代码后"
    echo "  2. 登录 https://app.netlify.com"
    echo "  3. 进入你的网站 → Deploys"
    echo "  4. 拖拽 math_practice 文件夹"
    echo ""
    exit 1
fi

# 检查是否有更改
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️  没有检测到代码更改"
    echo ""
    echo "如果要强制更新，请手动运行："
    echo "  git add ."
    echo "  git commit -m '更新描述'"
    echo "  git push origin main"
    echo ""
    exit 0
fi

# 显示更改的文件
echo "📝 检测到以下更改："
git status -s
echo ""

# 提交更改
read -p "请输入提交信息（直接回车使用默认）: " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="更新: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "📦 提交更改..."
git add .
git commit -m "$commit_msg"

# 检查是否有远程仓库
if git remote | grep -q "origin"; then
    echo "📤 推送到远程仓库..."
    current_branch=$(git branch --show-current)
    git push origin "$current_branch" || git push origin main || git push origin master
    
    echo ""
    echo "✅ 代码已推送！"
    echo ""
    
    # 检查是否连接了 Netlify
    if command -v netlify &> /dev/null; then
        echo "🌐 Netlify 将自动检测到更新并部署..."
    else
        echo "💡 提示：如果 Netlify 已连接 Git，会自动部署"
        echo "   如果没有连接，请访问 https://app.netlify.com 手动部署"
    fi
    
    echo ""
    echo "📊 查看部署状态: https://app.netlify.com"
else
    echo ""
    echo "⚠️  未检测到远程仓库"
    echo ""
    echo "请先添加远程仓库："
    echo "  git remote add origin https://github.com/你的用户名/仓库名.git"
    echo ""
    echo "或者手动在 Netlify 拖拽更新"
fi

