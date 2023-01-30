# stage build
FROM node:18-alpine

WORKDIR /app

# copy everything to the container
COPY . .

# clean install all dependencies
RUN yarn install --frozen-lockfile
    
# build SvelteKit app
RUN yarn run build


# stage run
FROM node:18-alpine

WORKDIR /app

# copy dependency list
COPY --from=0 /app/package.json ./
COPY --from=0 /app/yarn.lock ./

# clean install dependencies, no devDependencies, no prepare script
RUN yarn install --frozen-lockfile

# copy built SvelteKit app to /app
COPY --from=0 /app/build ./build
COPY --from=0 /app/static ./static

EXPOSE 3000
CMD ["node", "build"]
