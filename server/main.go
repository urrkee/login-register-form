package main

import (
	"fullstack/ecommerce-project/models"
	"fullstack/ecommerce-project/storage"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type User struct {
	UserName string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
type LoginData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Repository struct {
	DB *gorm.DB
}

func (r *Repository) Login(context *fiber.Ctx) error {
	logger := LoginData{}
	err := context.BodyParser(&logger)
	if err != nil {
		log.Println("Error parsing request body:", err)
		context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "invalid request"})
		return err
	}

	log.Println("Login attempt for email:", logger.Email)

	var user models.Users
	err = r.DB.Where("email = ?", logger.Email).First(&user).Error
	if err != nil {
		log.Println("Error finding user:", err)
		context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "invalid email or password"})
		return err
	}

	if user.Password != logger.Password {
		log.Println("Password mismatch for email:", logger.Email)
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Invalid email or password"})
	}

	log.Println("Login successful for email:", logger.Email)
	context.Status(http.StatusOK).JSON(&fiber.Map{
		"message":  "login successful",
		"username": user.UserName,
	})
	return nil
}

func (r *Repository) CreateUser(context *fiber.Ctx) error {
	user := User{}
	err := context.BodyParser(&user)
	if err != nil {
		context.Status(http.StatusUnprocessableEntity).JSON(
			&fiber.Map{"message": "request failed"})
		return err
	}
	err = r.DB.Create(&user).Error
	if err != nil {
		context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "could not create user"})
		return err
	}
	context.Status(http.StatusOK).JSON(&fiber.Map{"message": "user has been added"})
	return nil
}

func (r *Repository) GetUsers(context *fiber.Ctx) error {
	userModels := &[]models.Users{}

	err := r.DB.Find(userModels).Error
	if err != nil {
		context.Status(http.StatusBadRequest).JSON(
			&fiber.Map{"message": "Could not get the users"})
		return err
	}
	context.Status(http.StatusOK).JSON(
		&fiber.Map{"message": "users fetched seccesfully", "data": userModels})

	return nil
}

func (r *Repository) DeleteUser(context *fiber.Ctx) error {
	id := context.Params("id")
	if id == "" {
		context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "missing id"})
		return nil
	}

	err := r.DB.Delete(&models.Users{}, id).Error
	if err != nil {
		context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "could not delete user"})
		return err
	}

	context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User deleted successfully"})
	return nil
}

func (r *Repository) GetUserByID(context *fiber.Ctx) error {
	userModel := models.Users{}
	id := context.Params("id")
	if id == "" {
		context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "User not found"})
		return nil
	}
	err := r.DB.Where("id = ?", id).First(&userModel).Error
	if err != nil {
		context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Could not get user"})
		return err
	}

	context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User fetched successfully", "user": userModel})
	return nil
}

func (r *Repository) SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Post("/create_user", r.CreateUser)
	api.Post("/login", r.Login)
	api.Delete("/delete_user/:id", r.DeleteUser)
	api.Get("/get_users/:id", r.GetUserByID)
	api.Get("/users", r.GetUsers)
}
func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}
	config := &storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASS"),
		User:     os.Getenv("DB_USER"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
		DBName:   os.Getenv("DB_NAME"),
	}
	db, err := storage.NewConnection(config)

	if err != nil {
		log.Fatal("could not load the database")
	}

	err = models.MigrateUsers(db)
	if err != nil {
		log.Fatal("could not migrate users")
	}

	r := Repository{
		DB: db,
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Content-Type, Authorization",
		AllowCredentials: true,
	}))
	r.SetupRoutes(app)
	log.Fatal(app.Listen(":8080"))
}
