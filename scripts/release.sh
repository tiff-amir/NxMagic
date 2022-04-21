#!/usr/bin/env bash

addressUpdated=$(<./_temp/deploy-info/address)

echo "$addressUpdated"

if ! [[ $addressUpdated =~ ^0x[0-9a-fA-F]{40}$ ]]; then
  echo "Incorrect address"
  exit 1
fi

npm run addresses "$1"

next build
next export

abi="http://api-testnet.bscscan.com/api?module=contract&action=getabi&address=$addressUpdated&format=raw"

if [[ $1 =~ ^main$ ]]; then
  abi="http://api.bscscan.com/api?module=contract&action=getabi&address=$addressUpdated&format=raw"
fi

echo "$abi"

rm -rf ./out/_next/static/abis
mkdir ./out/_next/static/abis

content=$(curl -L "$abi")

echo "{\"abi\":$content,\"networks\":{\"1645632037003\":{\"address\":\"$addressUpdated\"}}}" > ./out/_next/static/abis/NxMagic.json;

rm -rf ./docs
mv ./out ./docs

touch ./docs/.nojekyll
echo "nxmagic.space" > ./docs/CNAME
