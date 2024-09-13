# Use a imagem base do Node.js
FROM node:18

# Crie um diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json (ou yarn.lock) para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Exponha a porta que a aplicação irá usar
EXPOSE 3000

# Defina o comando para iniciar a aplicação
CMD ["npm", "start"]