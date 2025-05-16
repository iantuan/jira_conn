#!/bin/bash

# 獲取服務器IP地址（可以根據需要修改此命令以獲取正確的網絡接口）
SERVER_IP=$(hostname -I | awk '{print $1}')

echo "Setting SERVER_IP to $SERVER_IP"
export SERVER_IP

# 啟動服務
docker-compose down
docker-compose up -d

echo "應用已啟動，請使用 http://$SERVER_IP:3000 訪問" 