##
# Build back
##
gui/back/build:
	cd back && \
		npm run build

##
# Run back for dev
##
gui/back/run:
	cd back && \
		GUI_PUBLIC_URL=http://localhost:3000 \
		GUI_PUBLIC_DIR=../front/build \
		GUI_CONFIG_FILE=./config.yaml \
		./node_modules/.bin/nest start --watch

##
# Open the swagger API console
##
gui/back/console:
	open http://localhost:3001/api/console

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
gui/build: gui/back/build gui/front/build
	make gui/packages/docker/build
	echo "Done!"

gui/docker/up: gui/build
	docker-compose up -d minio front
	open http://gui-127-0-0-1.nip.io
	docker-compose up app