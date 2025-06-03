FROM node:lts-alpine3.22 as dev-deps

WORKDIR /app

COPY package*.json ./

RUN npm install


FROM node:lts-alpine3.22 as builder

WORKDIR /app

COPY --from=dev-deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Usar nginx para servir la aplicación
FROM nginx:stable-perl as prod

EXPOSE 80

# Copiar los archivos construidos al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# COPY assets/ /usr/share/nginx/html/assets

# Copiar la configuración personalizada de nginx
RUN  rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

# Esta línea asegura que Nginx se ejecute correctamente como el proceso principal del contenedor Docker.
CMD [ "nginx","-g","daemon off;"]
