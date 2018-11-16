FROM nginx:1.13.12

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

COPY dist /var/www

ENTRYPOINT chmod -R 777 /var/www && nginx -g "daemon off;"