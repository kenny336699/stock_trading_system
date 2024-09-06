@echo off
echo Stopping Stock Trading System Database...
docker-compose down
echo Database stopped. Press any key to exit.
pause > nul
