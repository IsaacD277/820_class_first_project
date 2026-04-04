FROM node:24

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./

# Use the environment variable to force building from source
RUN npm_config_build_from_source=true npm install

COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
