#!/bin/bash

# 连接 GitHub 并推送代码的脚本
# GitHub 用户名: 1992huanghai
# 仓库名: math-practice

cd /Users/haihuang.hh/Documents/code/math_practice

GITHUB_USER="1992huanghai"
REPO_NAME="math-practice"

echo "🔗 连接 GitHub 仓库..."
echo "用户名: $GITHUB_USER"
echo "仓库名: $REPO_NAME"
echo ""

# 检查是否已存在远程仓库
if git remote | grep -q "origin"; then
    echo "⚠️  已存在远程仓库，先移除..."
    git remote remove origin
fi

# 添加远程仓库
echo "📦 添加远程仓库..."
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# 显示远程仓库信息
echo ""
echo "✅ 远程仓库已添加："
git remote -v
echo ""

# 推送代码
echo "📤 推送代码到 GitHub..."
echo "（如果是第一次推送，可能需要输入 GitHub 用户名和密码/token）"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码已成功推送到 GitHub！"
    echo ""
    echo "🌐 仓库地址: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
    echo "📝 下一步："
    echo "1. 访问 https://app.netlify.com"
    echo "2. 进入你的网站 → Site settings"
    echo "3. Build & deploy → Continuous Deployment"
    echo "4. 点击 Link repository → 选择 GitHub"
    echo "5. 选择 ${REPO_NAME} 仓库"
    echo "6. Build command 留空，Publish directory 填写: ."
    echo "7. 点击 Deploy site"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. GitHub 仓库还未创建，请先访问 https://github.com/new 创建仓库"
    echo "2. 需要输入 GitHub 用户名和密码/token"
    echo ""
    echo "如果仓库还未创建，请："
    echo "1. 访问 https://github.com/new"
    echo "2. Repository name: ${REPO_NAME}"
    echo "3. 选择 Public"
    echo "4. 不要勾选 'Initialize with README'"
    echo "5. 点击 Create repository"
    echo "6. 然后重新运行此脚本"
fi

