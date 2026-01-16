#!/bin/bash
# PostgreSQL Helper Script for Docker Container

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Function to run psql commands
psql_exec() {
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME "$@"
}

# Show usage
show_usage() {
  echo "Usage: ./db.sh [command]"
  echo ""
  echo "Commands:"
  echo "  connect          - Connect to database"
  echo "  tables           - List all tables"
  echo "  indexes          - List all indexes"
  echo "  migrate [file]   - Run migration file"
  echo "  query <sql>      - Execute SQL query"
  echo "  describe <table> - Show table structure"
  echo "  backup           - Backup database to file"
  echo ""
  echo "Examples:"
  echo "  ./db.sh connect"
  echo "  ./db.sh tables"
  echo "  ./db.sh migrate drizzle/0002_add_indexes_and_optimizations.sql"
  echo "  ./db.sh query 'SELECT * FROM products LIMIT 5;'"
  echo "  ./db.sh describe products"
}

# Main command handler
case "$1" in
  connect)
    psql_exec
    ;;
  tables)
    psql_exec -c "\dt"
    ;;
  indexes)
    psql_exec -c "\di"
    ;;
  migrate)
    if [ -z "$2" ]; then
      echo "Error: Migration file required"
      echo "Usage: ./db.sh migrate <file>"
      exit 1
    fi
    psql_exec < "$2"
    ;;
  query)
    if [ -z "$2" ]; then
      echo "Error: SQL query required"
      echo "Usage: ./db.sh query '<sql>'"
      exit 1
    fi
    psql_exec -c "$2"
    ;;
  describe|desc)
    if [ -z "$2" ]; then
      echo "Error: Table name required"
      echo "Usage: ./db.sh describe <table>"
      exit 1
    fi
    psql_exec -c "\d $2"
    ;;
  backup)
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > $BACKUP_FILE
    echo "Backup saved to: $BACKUP_FILE"
    ;;
  *)
    show_usage
    ;;
esac
