# Build stage
FROM node:14 as build-stage
WORKDIR /app/
COPY . .
RUN npm install
RUN npm run ng build --prod

# Compiled app based on nginx. nginx runs on 1827 by default
FROM nginx:1.19
WORKDIR /app/
COPY --from=build-stage /app/dist/ /app/
COPY /nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 1827
