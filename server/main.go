package main

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Item struct {
	gorm.Model
	Name        string `json:"name"`
	Priority    uint   `json:"priority"`
	Date        string `json:"date"`
	Description string `json:"description"`
	Done        bool   `json:"done"`
}
type Projects struct {
	gorm.Model
	Name  string  `json:"name"`
	Items []*Item `gorm:"many2many:projects_Item;"`
}

// type Todo struct {
// 	gorm.Model
// 	Title string `json:"title"`
// 	Done bool `json:"done"`
// 	Body string `json:"body"`
// }

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	app := fiber.New()

	if err != nil {
		panic("The connection with the db is F@#*!")
	}

	db.AutoMigrate(&Projects{})
	db.AutoMigrate(&Item{})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})

	app.Get("/api/projects", func(c *fiber.Ctx) error {
		var projects []Projects

		db.Find(&projects)

		return c.JSON(projects)
	})
	app.Post("/api/projects", func(c *fiber.Ctx) error {
		var project Projects
		Nproject := &Projects{}
		if err := c.BodyParser(Nproject); err != nil {
			return err
		}
		projectCreate := db.Create(&Nproject)
		if projectCreate.Error != nil {
			return projectCreate.Error
		}
		db.First(&project, Nproject.ID)

		return c.JSON(project)
	})

	// app.Get("/check", func(c *fiber.Ctx) error {
	// 	return c.SendString("ok")
	// })

	// app.Post("/api/todos", func(c *fiber.Ctx) error {
	// 	var todo Todo
	// 	Ntodo := &Todo{}

	// 	if err := c.BodyParser(Ntodo); err != nil{
	// 		return err
	// 	}

	// 	todoCreate := db.Create(&Ntodo)
	// 	if todoCreate.Error != nil{
	// 		return todoCreate.Error
	// 	}
	// 	db.First(&todo, Ntodo.ID)

	// 	return c.JSON(todo)

	// })

	//  app.Patch("api/todos/:id/done", func(c *fiber.Ctx) error {
	// 	id, err := c.ParamsInt("id")
	//  	if err != nil{
	//  		return c.Status(401).SendString("Invalid id")
	//  	}
	// 	var todo Todo
	// 	db.First(&todo, id)
	// 	todo.Done = true
	// 	db.Save(&todo)
	//  	return c.JSON(todo)
	//  })

	// app.Get("/api/todos", func(c *fiber.Ctx) error {
	// 	var todos []Todo
	// 	db.Find(&todos)

	// 	return c.JSON(todos)
	// })

	log.Fatal(app.Listen(":8000"))
}
