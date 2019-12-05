<<<<<<< HEAD
rclone sync -v floodmap:Documents /home/pi/Documents
git add .
git commit -m "new data"
git push origin master
rclone sync -v /home/pi/Documents floodmap:Documents
=======
git add .
git commit -m "new data"
git push origin master
>>>>>>> 63c766be230afd0185617f0cec6bf109e6653f93
