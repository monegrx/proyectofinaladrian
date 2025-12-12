# Imagen base
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Luego copiar el resto del código
COPY . .

# Establecer variables de entorno por defecto (puedes sobrescribir con .env)
ENV PORT=3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]

