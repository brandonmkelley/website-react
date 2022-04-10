
curl -s https://packagecloud.io/install/repositories/immortal/immortal/script.deb.sh | sudo bash
sudo apt install immortal

sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 4430

immortal npm run mongod --prefix ../
# needs replset? mongod --prefix ../ --replSet=rs0 --bind_ip localhost
immortal node ../src/server/src/redirect.js --app website-react
immortal npm run prod --prefix ../ -- --app website-react

immortalctl

