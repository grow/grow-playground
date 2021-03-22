project ?= grow-prod
version ?= staging
repo ?= github_blinkkcode_starter
repo_url ?= git@github.com:blinkkcode/starter.git
dashboard_service_account ?= blinkkbot-goog@appspot.gserviceaccount.com

include Makefile.buildbot

install:
	pip install grow
	grow install

test:
	grow build
	npm run test

stage:
	PATH=$(PATH):$(HOME)/bin grow stage \
	  --api-key=cae5efdd-f655-4648-bcb1-29c12c8cbe9d

stage-gae:
	PATH=$(PATH):$(HOME)/bin grow deploy -f staging
	gcloud app deploy \
	  -q \
	  --project=$(project) \
	  --version=$(version) \
	  --verbosity=error \
	  --no-promote \
	  app.yaml

deploy:
	PATH=$(PATH):$(HOME)/bin grow deploy -f prod
	gcloud app deploy \
	  -q \
	  --project=$(project) \
	  --version=$(version) \
	  --verbosity=error \
	  --promote \
	  app.yaml

deploy-dispatch:
	gcloud app deploy \
	  -q \
	  --project=$(project) \
	  --verbosity=error \
	  dispatch.yaml

run:
	dev_appserver.py --allow_skipped_files=true .

cloudbuild:
	gcloud builds submit . \
	  --project=$(project) \
	  --config=cloudbuild.yaml
