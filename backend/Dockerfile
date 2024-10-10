FROM golang:1.22-alpine as builder
WORKDIR /app
RUN apk add --no-cache git openssl
COPY . ./
RUN go build -o bin/platnm cmd/server/main.go

FROM scratch
COPY --from=builder /app/bin/platnm /platnm
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENV APP_ENVIRONMENT production
ENTRYPOINT [ "./platnm" ]
