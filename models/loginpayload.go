package models

type LoginPayload struct {
	Username string `json:"username" validate:"required,min=6,max=16"`
	Password string `json:"password"`
}
