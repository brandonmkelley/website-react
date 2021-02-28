
ps -ef | grep immortal | grep -v grep | awk '{print $2}' | xargs immortalctl exit

ps -ef | grep website-react | grep -v grep | awk '{print $2}' | xargs sudo kill

ps -ef | grep mongo | grep -v grep | awk '{print $2}' | xargs sudo kill

