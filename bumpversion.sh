#!/usr/bin/env bash

set -eux

RELEASE_BRANCH=master

_get_maven_version() {
  # extract version from pom.xml
  version=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
  echo "${version}"
}

_set_maven_version() {
  local suffix="$1"; shift

  # use Maven versions plugin to bump version
  mvn build-helper:parse-version versions:set \
    -DnewVersion=\${parsedVersion.majorVersion}.\${parsedVersion.minorVersion}.\${parsedVersion.nextIncrementalVersion}${suffix} \
    versions:commit
}

_set_grails_version() {
  local version=$1; shift
  grails set-version "${version}"
}

_update_git() {
  local version=$1; shift
  git fetch --prune origin "+refs/tags/*:refs/tags/*"
  git add pom.xml application.properties
  git commit -m "Bump version to ${version}"
  git tag -a -f -m "Bump version to ${version}" ${version}
  git push origin tag ${version}
  git push origin "HEAD:${RELEASE_BRANCH}"
}

_bumpversion() {
  local suffix=$1; shift
  _set_maven_version "$suffix" &>/dev/null
  local new_version=$(_get_maven_version)
  _set_grails_version "${new_version}"
  echo "${new_version}"
}

build() {
  local suffix="-dev"
  _bumpversion "$suffix"
}

release() {
  local suffix=" "
  _bumpversion "$suffix"
  local new_version=$(_get_maven_version)
  _update_git "${new_version}"
}

main() {
  local mode=$1; shift

  if [ "x${mode}" == "xrelease" ]; then
    release
  elif [ "x${mode}" == "xbuild" ]; then
    build
  fi

  exit 0
}

main "$@"
