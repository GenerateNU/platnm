FROM golang:1.22-alpine as builder
WORKDIR /app
RUN apk add --no-cache git openssl
COPY . ./
RUN go build -o bin/platnm cmd/server/main.go

RUN openssl req -new -x509 -sha256 -nodes -newkey rsa:2048 -keyout server.key -out server.crt -days 3650 -subj "/C=US/ST=MA/L=Boston/O=Generate/CN=platnm"
RUN sudo update-ca-certificates

FROM scratch
COPY --from=builder /app/bin/platnm /platnm
COPY --from=builder /app/server.key /server.key
COPY --from=builder /app/server.crt /server.crt
ENV APP_ENVIRONMENT production
ENTRYPOINT [ "./platnm" ]
