gui/back/build:
	cd back && \
		npm run build

gui/back/run:
	cd back && \
		GUI_PUBLIC_DIR=../front/build \
		GUI_CONFIG_FILE=./config.yaml \
		./node_modules/.bin/nest start --watch

gui/front/build:
	cd front && \
		npm run build

gui/front/run:
	cd front && \
		npm start --watch

gui/packages/docker/build:
	docker-compose build app

##
# Build ALL: projects, docker image
##
gui/build: gui/back/build gui/front/build gui/packages/docker/build
	echo "Done!"

gui/build_and_run: gui/build
	docker-compose up app

gui/dev/compose/up:
	docker-compose up -d minio