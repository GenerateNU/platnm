FROM golang:1.22-alpine as builder
WORKDIR /app
RUN apk add --no-cache git
COPY . ./
RUN go build -o bin/platnm cmd/server/main.go
FROM scratch
COPY --from=builder /app/bin/platnm /platnm
ENV APP_ENVIRONMENT production
ENTRYPOINT [ “./platnm ]