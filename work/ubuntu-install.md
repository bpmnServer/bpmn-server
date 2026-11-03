# Installing bpmn-server on a clean Ubuntu

For Ubuntu 22.04 or 24.04. You need Node.js and a MongoDB database. A web server such as Apache or nginx is
optional (see step 5).

## 1. Install Node.js 22 (bpmn-server needs Node 20 or later)

```sh
sudo apt update
sudo apt install -y curl ca-certificates gnupg git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version && npm --version
```

## 2. Set up a database (choose one)

**A. MongoDB as a service** (recommended):

```sh
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/8.0 multiverse" \
  | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

This MongoDB apt repository covers 22.04 (jammy) and 24.04 (noble). On other Ubuntu releases, use option B.

**B. MongoDB in Docker** (if Docker is already installed):

```sh
docker run -d --name mongo --restart unless-stopped -p 27017:27017 -v mongo-data:/data/db mongo:8
```

**C. No database**: run `init` with `--memory` in step 3. The data is lost when the app stops, so use this
only to try it out.

## 3. Create and run the application

```sh
npx bpmn-server init my-app --yes --mongo mongodb://localhost:27017/my-app
#   or: npx bpmn-server init my-app --memory
cd my-app
npm run verify      # optional check
npm run setup       # creates the indexes and the first user (admin / admin)
npm start           # http://localhost:3000
```

Open `http://<server-ip>:3000` and sign in as `admin` with password `admin`. Change that password straight
away.

Useful `init` options:

- `--minimal` creates a one-model Hello app.
- `--port <n>` changes the port.
- `--api-only` or `--ui-only` serves only the APIs or only the web pages.
- `--no-auth` turns off sign-in (development only).
- `npx bpmn-server init --help` lists all of them.

`init` first ships in bpmn-server 3.5.

## 4. Keep it running

```sh
sudo npm install -g pm2
pm2 start npm --name my-app -- start
pm2 save && pm2 startup     # then run the command it prints
```

To reach the app directly on port 3000, open that port:

```sh
sudo ufw allow 3000/tcp
```

## 5. Optional: a reverse proxy for a domain and HTTPS

The app runs its own web server, so it doesn't need Apache. You only add a web server in front of it if you
want:

- the app on port 80/443 instead of `:3000`
- HTTPS with a certificate (Let's Encrypt)
- several sites on one server by domain name

nginx is the more common choice with Node apps:

```sh
sudo apt install -y nginx certbot python3-certbot-nginx
```

`/etc/nginx/sites-available/my-app`:

```nginx
server {
    server_name bpmn.example.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```sh
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d bpmn.example.com
sudo ufw allow 'Nginx Full'
```

If Apache is already installed and you'd rather keep it, enable `proxy`, `proxy_http` and `proxy_wstunnel`
(`sudo a2enmod proxy proxy_http proxy_wstunnel`) and add `ProxyPass / http://localhost:3000/` and
`ProxyPassReverse / http://localhost:3000/` to the site's config.

When a proxy sits in front, open only ports 80 and 443 in the firewall and leave 3000 closed.

## 6. Optional: call it from another app (bpmn-client)

```sh
mkdir client && cd client && npm init -y && npm pkg set type=module
npm install bpmn-client
npx bpmn-client-setup       # set API_KEY from my-app/.env, plus HOST and PORT
npx bpmn-client-cli
```

See [bpmn-client](https://bpmnserver.github.io/docs/bpmn-client) for its API.
