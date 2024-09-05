
curl -s https://packagecloud.io/install/repositories/immortal/immortal/script.deb.sh | sudo bash
sudo apt install immortal

sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 4430

sudo cp -L /etc/letsencrypt/live/kelley-family.org/cert.pem ../src/server/static
sudo cp -L /etc/letsencrypt/live/kelley-family.org/fullchain.pem ../src/server/static
sudo cp -L /etc/letsencrypt/live/kelley-family.org/privkey.pem ../src/server/static
sudo chown ubuntu:ubuntu ../src/server/static/*
chmod 600 ../src/server/static/*

immortal npm run mongod --prefix ../
immortal node ../src/server/src/redirect.js --app website-react
immortal npm run prod --prefix ../ -- --app website-react

immortalctl

