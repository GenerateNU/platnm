package errs

import (
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
)

func IsUniqueViolation(err error, constraintName string) bool {
	if pgErr, ok := err.(*pgconn.PgError); ok {
		return pgErr.Code == pgerrcode.UniqueViolation && pgErr.ConstraintName == constraintName
	}

	return false
}

func IsForeignKeyViolation(err error, constraintName string) bool {
	if pgErr, ok := err.(*pgconn.PgError); ok {
		return pgErr.Code == pgerrcode.ForeignKeyViolation && pgErr.ConstraintName == constraintName
	}

	return false
}
