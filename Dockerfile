# Source: https://dev.to/code42cate/how-to-dockerize-sveltekit-3oho#/
# Use a Node.js Alpine image for the builder stage
FROM node:25-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# Use another Node.js Alpine image for the final stage
FROM node:25-alpine
# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/build build/
COPY --from=builder --chown=nodejs:nodejs /app/node_modules node_modules/
COPY --chown=nodejs:nodejs package.json .
# Switch to non-root user
USER nodejs
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
