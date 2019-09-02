```
openssl genrsa -out server.key 2048
openssl rsa -in server.key -out server-key.pem
openssl req -new -key server-key.pem -out server-request.csr
openssl x509 -req -extensions v3_req -days 365 -in server-request.csr -signkey server-key.pem -out server-cert.pem -extfile openssl.cnf
```