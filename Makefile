NODE_BIN = node_modules/.bin
SRC = src
DIST = dist

lint:
	@echo Linting...
	@$(NODE_BIN)/standard --verbose | $(NODE_BIN)/snazzy src/index.js

lint-fix:
	@echo Linting...
	@$(NODE_BIN)/standard --fix --verbose | $(NODE_BIN)/snazzy src/index.js

convertCSS:
	@echo Converting css...
	@node bin/transferSass.js

build: lint-fix
	@echo Removing dist folder...
	@rm -rf dist && mkdir dist
	@echo Converting sass to style.css...
	@make convertCSS
	@echo Building js files...
	@$(NODE_BIN)/babel $(SRC) --out-dir $(DIST)
	@echo success!

.PHONY: lint convertCSS lint-fix build
