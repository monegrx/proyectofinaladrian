FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

# Instala Python y otras herramientas necesarias
RUN apt update && \
    apt upgrade -y && \
    apt install -y python3 python3-pip nmap git && \
    apt autoremove -y && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Copia tu proyecto al contenedor (ajusta si es necesario)
COPY untitled/dist /app

# Establece el directorio de trabajo
WORKDIR /app

# Expone el puerto donde serviremos el sitio
EXPOSE 3000

# Comando para iniciar servidor web de Python
CMD ["python3", "-m", "http.server", "3000"]
