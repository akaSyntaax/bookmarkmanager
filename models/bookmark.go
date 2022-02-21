package models

import (
	"gopkg.in/guregu/null.v4"
	"time"
)

type Bookmark struct {
	ID      uint32      `json:"id"`
	Title   null.String `json:"title" validate:"min=1,max=64"`
	URL     string      `json:"url" validate:"required,max=256,url"`
	Created time.Time   `json:"created"`
}
