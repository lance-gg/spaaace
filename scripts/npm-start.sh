#!/bin/bash
source /home/ec2-user/.bash_profile
cd /var/games/spaaace
PORT=3001 npm start >spaaace.out 2>spaaace.err &
      
