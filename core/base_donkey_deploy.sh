#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

red() { echo -e "\033[1;31m$*\033[0m"; }
blue() { echo -e "\033[1;34m$*\033[0m"; }
yell() { echo "$(red "$*")" >&2; }
say() { echo "$(blue "$*")" >&2; }
die() { yell "$*"; exit 111; }
try() { "$@" || die "cannot $*"; }

# User Input Verification
# TODO: checks to see wether user running has all permissions,


DEPLOYING_TO_PROD=false
if test "$ENVIRONMENT" = prod; then
  DEPLOYING_TO_PROD=true
fi

#say Activating Virtual Env..
#venv/bin/activate

#say Checking Python requirements...
#pip3 install -r ./requirements.txt > /dev/null 2>&1

say ====================================================================
say "Please run me from root of donkey_the_deployer repo."
say "Example 1: ./project/{project_folder_you_created}/deploy.sh {name-of-microservice-to-deploy}"
say "Example 2: ./project/{project_folder_you_created}/deploy_to_e2e.sh"
say ====================================================================

yell PROJECT: $PROJECT
yell PRODUCT: $PRODUCT
yell ENVIRONMENT: $ENVIRONMENT
yell KUBE-CONTEXT: $KUBE_CONTEXT
yell KUBE-NAMESPACE: $KUBE_NAMESPACE
yell DEPLOYING SERVICES: ${*:-ALL}
services_to_deploy="'$*'"

if [[ "$ENVIRONMENT" != "e2e" ]]
then
  read -p "Does everything look right(Y/N)?" -n 1 -r
  echo  #move to a new line
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
      [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
  fi

  say ====================================================================

# Push current configs to repo before deploying
  say "Pushing to git before deploying services: ${services_to_deploy}"
  git checkout master
  git pull
  git add -A
  git commit -m "Deploying ${services_to_deploy} to $PRODUCT:$ENVIRONMENT." || true
  git push || yell "git push did not succeed, but we will still push.  Please handle the git changes by yourself."
fi

# TODO: Trigger build on images

# Variable replacing
temp_dir=$(mktemp -d /tmp/donkey_XXXXXXXXXX)
cp -r projects/$PROJECT/* $temp_dir
say "Template files in dir ${temp_dir}"
say ====================================================================

say "Parsing Templates"

if [ $# -eq 0 ]; then
  say "No arguments provided. $(red Deploy all services.)"
  python3 core/parse_template.py -t $temp_dir \
    -p $PRODUCT  -e $ENVIRONMENT
else
  say "Deploy services: $(red $@) only."
  python3 core/parse_template.py -t $temp_dir \
    -p $PRODUCT  -e $ENVIRONMENT -s "$@"
fi

say "Applying kube configs"

pushd ${temp_dir}/service_templates

say $temp_dir
for project in `ls -p | grep "/"`; do
  for file in `ls -R $project | grep -e '.yaml\|.yml'`; do
    full_path=${project}${file}
    say '> Applying kube config: ' ${full_path} 'on context: ' ${KUBE_CONTEXT} ' namespace: ' ${KUBE_NAMESPACE}
    if [ -z "$KUBE_NAMESPACE" ]; then
      kubectl --context=$KUBE_CONTEXT apply -f ${full_path}
    else
      kubectl --context=$KUBE_CONTEXT --namespace=$KUBE_NAMESPACE apply -f ${full_path}
    fi
  done
done

popd
