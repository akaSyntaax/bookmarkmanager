package models

import (
	"time"
)

type User struct {
	ID           uint32    `json:"id"`
	Username     string    `json:"username" validate:"required,min=6,max=16"`
	PasswordHash string    `json:"-"`
	Created      time.Time `json:"created"`
}
