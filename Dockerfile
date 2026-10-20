# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM base AS build
# NEXT_PUBLIC_* are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME \
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=$NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# next 15.5's `next start` transpiles next.config.ts and needs the typescript
# package present at runtime. It is a devDependency, so --omit=dev skips it and
# a plain `npm install --no-save typescript` would skip it too; install it from
# an isolated prefix (typescript has zero runtime deps) and copy it in.
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev \
    && npm install --prefix /tmp/tsinstall --no-package-lock typescript@5 \
    && cp -R /tmp/tsinstall/node_modules/typescript /app/node_modules/ \
    && rm -rf /tmp/tsinstall
COPY --chown=node:node --from=build /app/.next ./.next
COPY --chown=node:node --from=build /app/public ./public
COPY --chown=node:node --from=build /app/next.config.ts ./next.config.ts
COPY --chown=node:node --from=build /app/tsconfig.json ./tsconfig.json
USER node
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
