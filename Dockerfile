FROM ubuntu:16.04

ENV GRAILS_VERSION 2.4.4
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64
ENV GRAILS_HOME /usr/lib/jvm/grails
ENV PATH $GRAILS_HOME/bin:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-8-jdk \
    maven \
    unzip \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/lib/jvm
RUN wget https://github.com/grails/grails-core/releases/download/v$GRAILS_VERSION/grails-$GRAILS_VERSION.zip && \
    unzip grails-$GRAILS_VERSION.zip && \
    rm -rf grails-$GRAILS_VERSION.zip && \
    ln -s grails-$GRAILS_VERSION grails
