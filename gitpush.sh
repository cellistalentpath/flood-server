#!/bin/sh

mkdir /home/pi/Documents
cd /home/pi/Documents

rclone sync -v floodmap:Documents /home/pi/Documents
git add .
git commit -m "new data"
git push origin master
rclone sync -v /home/pi/Documents floodmap:Documents
