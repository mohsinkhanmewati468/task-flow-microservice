FROM node:18

WORKDIR /app

# copy root package files
COPY package*.json ./

# install dependencies
RUN npm install

# copy entire project (because monorepo)
COPY . .

# build all apps
RUN npm run build

# run ONLY task-service
CMD ["node", "dist/apps/task-service/main.js"]