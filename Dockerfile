FROM debian:8.1

MAINTAINER Charlie Briggs "charliebriggs@gmail.com"

# Add non-root user
RUN USER="node" && \
	adduser --disabled-password --gecos '' $USER && \
	usermod -a -G sudo $USER && \
  mkdir -p /home/node && \
  chown -R node:node /home/node && \
	echo "$USER:password" | chpasswd

# Install base packages
# Set noninteractive front end but don't set as ENV as we don't want it in the container
RUN DEBIAN_FRONTEND=noninteractive && \
	apt-get update && \
	apt-get install -y \
	build-essential \
	tar \
  python \
	wget && \
	apt-get clean && \
# Cleanup install files to save layer space
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Versions here so as not to break cache when bumping node versions
ENV IOJS_VERSION 2.3.3
ENV NPM_VERSION 2.13.0
ENV NODE_ENV production

# Install IO.js
RUN mkdir /opt/iojs && \
	wget -P /opt https://iojs.org/dist/v$IOJS_VERSION/iojs-v$IOJS_VERSION-linux-x64.tar.xz && \
	tar xfJ /opt/iojs-v$IOJS_VERSION-linux-x64.tar.xz --strip-components=1 -C /opt/iojs && \
	rm /opt/iojs-v$IOJS_VERSION-linux-x64.tar.xz

USER node

# Create node modules folder for global install without global permissions
# http://stackoverflow.com/a/19379795/580268
RUN MODULES="local" && \
	echo prefix = ~/$MODULES >> ~/.npmrc && \
	echo "export PATH=\$HOME/$MODULES/bin:\$PATH" >> ~/.bashrc && \
	. ~/.bashrc && \
	mkdir ~/$MODULES

ENV PATH $PATH:/opt/iojs/bin

# Update NPM
RUN npm install -g npm@$NPM_VERSION

# Copy our app (do this last so as to not break cache)
COPY . /home/node

WORKDIR /home/node

# I'd normally forgoe this npm install and have it performed on the client before copying to docker, but I've left it for convenience
RUN npm install

EXPOSE 5000

RUN chmod -R 777 /home/node

# Entrypoint commands will go to iojs prompt by default eg our default command runs /opt/iojs/bin/node /home/node/recipes.js
ENTRYPOINT ["/opt/iojs/bin/node"]

CMD ["recipes.js"]
