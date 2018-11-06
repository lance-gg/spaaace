#!/bin/bash
source /home/ec2-user/.bash_profile
mkdir -p /var/games/spaaace
cd /var/games/spaaace
npm install

# upload static files to s3
cd /var/games/spaaace/dist && aws s3 sync --acl public-read --delete . s3://spaaace.lance.gg

 # invalidate CDN
aws configure set preview.cloudfront true && aws cloudfront create-invalidation --distribution-id E1DCUODC5JNVXV --paths "/*"

