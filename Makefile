gui/back/build:
	cd back && \
		npm run build

gui/front/build:
	cd front && \
		npm run build

gui/packages/docker/build:
	docker-compose build app

gui/build: gui/back/build gui/front/build gui/packages/docker/build
	echo "Done!"

gui/build_and_run: gui/build
	docker-compose up app
