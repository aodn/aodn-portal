FROM ubuntu:16.04

ARG BUILDER_UID=9999

ENV GRAILS_VERSION 2.4.4
ENV HOME /home/builder
ENV JAVA_TOOL_OPTIONS -Duser.home=/home/builder
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64
ENV GRAILS_HOME /usr/lib/jvm/grails
ENV PATH $GRAILS_HOME/bin:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libxml2-utils \
    maven \
    openjdk-8-jdk \
    python3-dev \
    telnet \
    unzip \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 10

RUN wget -q https://bootstrap.pypa.io/pip/3.5/get-pip.py \
    && python get-pip.py pip==18.1 setuptools==49.6.0 wheel==0.35.1 \
    && rm -rf get-pip.py

#RUN pip install \
#    bump2version==0.5.10 \

WORKDIR /usr/lib/jvm
RUN wget https://github.com/grails/grails-core/releases/download/v$GRAILS_VERSION/grails-$GRAILS_VERSION.zip && \
    unzip grails-$GRAILS_VERSION.zip && \
    rm -rf grails-$GRAILS_VERSION.zip && \
    ln -s grails-$GRAILS_VERSION grails

RUN useradd --create-home --no-log-init --shell /bin/bash --uid $BUILDER_UID builder
USER builder
WORKDIR /home/builder
