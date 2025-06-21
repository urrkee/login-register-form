package models

import (
	"gorm.io/gorm"
)

type Users struct {
	ID       uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	UserName string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func MigrateUsers(db *gorm.DB) error {
	return db.AutoMigrate(&Users{})
}
