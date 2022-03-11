#!/bin/bash
QINIU_AK=$1
QINIU_SK=$2

#GetToken
TOKEN=`echo "/v2/tune/refresh" |openssl dgst -binary -hmac $TOKEN -sha1 |base64 | tr + - | tr / _`
#Refresh
curl -X POST -H "Authorization: QBox $QINIU_AK:$token" http://fusion.qiniuapi.com/v2/tune/refresh -d '{"urls":["https://raycn.pub/index.html","https://raycn.pub/archives/index.html"]}' -H 'Content-Type: application/json'