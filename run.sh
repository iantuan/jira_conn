#!/bin/bash

# 獲取服務器IP地址（可以根據需要修改此命令以獲取正確的網絡接口）
SERVER_IP=$(hostname -I | awk '{print $1}')

echo "Setting SERVER_IP to $SERVER_IP"
export SERVER_IP

# 檢測Docker版本並使用適當的命令
if docker compose version &>/dev/null; then
    # 較新版本的Docker (Docker Compose V2) 使用 'docker compose'
    echo "使用新版Docker Compose V2"
    
    # 停止並刪除現有容器
    docker compose down
    
    # 重新構建並啟動容器
    docker compose up -d --build
else
    # 較舊版本的Docker使用 'docker-compose'
    echo "使用傳統Docker Compose"
    
    # 停止並刪除現有容器
    docker-compose down
    
    # 重新構建並啟動容器
    docker-compose up -d --build
fi

echo "應用已啟動，請使用 http://$SERVER_IP:3000 訪問" 