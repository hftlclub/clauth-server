# clauth-server

Simple Auth server with JWT


## Installation and start

```bash
npm install
npm run build
npm start
```

Do not forget to provide RSA keys (see below).

## Generating RSA key pair

JWT tokens are signed with the asymmetric `RS256` algorithm.
We need to provide an RSA key pair for that:

```bash
openssl genpkey -algorithm RSA -out keys/private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in keys/private.pem -out keys/public.pem
```


