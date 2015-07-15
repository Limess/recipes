FROM debian:8.1

MAINTAINER Charlie Briggs "charliebriggs@gmail.com"

# Add non-root user
RUN USER="node" && \
	adduser --disabled-password --gecos '' $USER && \
	usermod -a -G sudo $USER && \
	echo "$USER:password" | chpasswd

# Install base packages
RUN DEBIAN_FRONTEND=noninteractive && \
	apt-get update && \
	apt-get install -y \
	build-essential \
	tar \
	wget && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV IOJS_VERSION 2.3.3
ENV NPM_VERSION 2.13.0

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

RUN npm install -g npm@$NPM_VERSION

COPY . /home/node

EXPOSE 5000

ENTRYPOINT ["iojs"]

CMD ["/home/node/src/app.js"]
