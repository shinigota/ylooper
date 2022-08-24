# bbar-envdev-node

FROM node:16.16.0

WORKDIR /home/app
USER node
ENV PORT 4200

EXPOSE 4200 49153

ENTRYPOINT /bin/bash
