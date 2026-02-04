.PHONY: help env clean dev prod

# Branch configuration
DEV_BRANCH = dev
PROD_BRANCH = prod

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

env: ## Generate .env file from conf/setup.conf
	@if [ ! -f conf/setup.conf ]; then \
		echo "Error: conf/setup.conf not found!"; \
		exit 1; \
	fi
	@cp conf/setup.conf .env
	@echo ".env file generated successfully!"

dev: ## Setup development environment (switch to dev branch and install)
	@echo "Setting up development environment..."
	@git fetch origin
	@git checkout $(DEV_BRANCH)
	@git pull origin $(DEV_BRANCH)
	@echo "Installing dependencies..."
	@yarn install
	@echo "Development environment ready!"

prod: ## Setup production environment (switch to prod branch and install)
	@echo "Setting up production environment..."
	@git fetch origin
	@git checkout $(PROD_BRANCH)
	@git pull origin $(PROD_BRANCH)
	@echo "Installing dependencies..."
	@yarn install
	@echo "Production environment ready!"

clean: ## Remove generated .env file
	@rm -f .env
	@echo ".env file removed"
