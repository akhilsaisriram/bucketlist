#!/bin/sh

# Dynamically set multiple environment variables into the env-config.js file
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js
echo "  REACT_APP_BASE_URL: \"${REACT_APP_BASE_URL}\"," >> /usr/share/nginx/html/env-config.js
echo "  REACT_APP_BASE_URL_CHAT: \"${REACT_APP_BASE_URL_CHAT}\"" >> /usr/share/nginx/html/env-config.js
echo "};" >> /usr/share/nginx/html/env-config.js

# Start Nginx
nginx -g "daemon off;"
