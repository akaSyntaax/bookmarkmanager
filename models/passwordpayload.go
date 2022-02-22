package models

type PasswordPayload struct {
	Password string `json:"password" validate:"required,min=8,max=64"`
}
