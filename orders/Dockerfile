FROM node:16-alpine
 
# Add the following lines
ENV CI=true
ENV WDS_SOCKET_PORT=0
 
WORKDIR /app
COPY package.json ./ 
RUN npm install --only=prod
COPY ./ ./
 
CMD ["npm", "start"]

# --only=prod says dont install those dependencies whenever we build image -> @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server avoiding 80 mgb file every rebuild our image
# --only=prod = avoiding redownloading mongodb memory srver everythime 
# copy over just package.json file then coppy ./ ./ everything from auth directory. 
# for npm install its only package.json file is needed thats why we copy only this first 
# node:16-alpine inculed pre installed node and npm is inculed in node image above but not package.json file. 
# npm needs package.json file inside of container. specificaly all the dependancies thats required to run the project "express":"*"
# current working directory = ./
# in oder to avoid overwrite files in root directory we define working directory WORKDIR /app
# in order to automaticly copy changes in container we have to copy this changes
# if we make changes  in case COPY ./ ./ is abovce npm instal we must exicute everithing whats after it again meanig RUN npm install ->
# so unnessesary reinstall of npm. we avoid it if we put copy ./ ./ after it what means copy averything from working directory if detected any changes
# if we make changes in dependencies only then we must reinstall npm
# if we put COPY ./ ./ at the end means = by changing one of our src files we dont reinstall npm. 
# changes in src files cause rebuilding the image but not reinstaling the npm 