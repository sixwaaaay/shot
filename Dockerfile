# 使用 Node 18 作为基础镜像
FROM node:20.18.0-slim

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到容器中，并安装依赖
COPY package*.json ./
RUN npm install

# 将项目代码复制到容器中
COPY . .

# 运行 npm build 命令构建项目
RUN npm run build

# 将构建后的代码放在 nginx 的默认目录下
FROM nginx:alpine
COPY --from=0 /app/dist/spa /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动 nginx 服务
CMD ["nginx", "-g", "daemon off;"]
