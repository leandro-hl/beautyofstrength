#!/bin/bash

HOY=`date +%a-%Y-%m-%d`
DIA=`date +%a`
FILE_PREFIX=bos_prod

SYSTEM_FOLDER=/srv/bos-prod
BACK_FOLDER=/srv/backup

DBFILE=${FILE_PREFIX}-${HOY}

date >> /tmp/backup.log
printenv >> /tmp/backup.log

rm -f ${BACK_FOLDER}/${FILE_PREFIX}-${DIA}*

echo "Starting mkbak ..."

cd ${SYSTEM_FOLDER} && pwd && docker compose exec -T postgres sh -c 'PGPASSWORD="${POSTGRESQL_PASSWORD}" pg_dump -U ${POSTGRESQL_USERNAME} ${POSTGRESQL_DATABASE}' | gzip > ${BACK_FOLDER}/${DBFILE}.psql.gz