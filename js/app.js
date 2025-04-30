// Initialize SQLite database
let db;

async function initDB() {
  // Load SQL.js
  const SQL = await initSqlJs({
    locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm"
  });

  // Create new database
  db = new SQL.Database();

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      is_featured BOOLEAN DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      proficiency INTEGER CHECK (proficiency BETWEEN 0 AND 100)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote TEXT NOT NULL,
      author TEXT NOT NULL,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample data if tables are empty
  if (!db.exec("SELECT 1 FROM projects LIMIT 1").length) {
    const projects = [
      { title: "E-Commerce Site", description: "Built with React & Node.js", image: "project1.jpg", is_featured: 1 },
      { title: "Weather App", description: "Uses OpenWeather API", image: "project2.jpg", is_featured: 0 },
      { title: "Restraunt Site", description: "HTML/CSS/JS", image: "project3.jpg", is_featured: 1 },
      { title: "Educational Site", description: "Built withHTML/CSS/JS", image: "project4.jpg", is_featured: 0 },
      { title: "Blog Platform", description: "Built with Django", image: "project5.jpg", is_featured: 1 },
      { title: "Chat App", description: "Real-time chat application", image: "project6.jpg", is_featured: 0 },
      { title: "Task Manager", description: "Task management app", image: "project7.jpg", is_featured: 0 },
      { title: "Social Media App", description: "Connect with friends", image: "project8.jpg", is_featured: 0 },
      { title: "Fitness Tracker", description: "Track your workouts", image: "project9.jpg", is_featured: 0 }
    ];
    projects.forEach(p => {
      db.run("INSERT INTO projects (title, description, image, is_featured) VALUES (?, ?, ?, ?)", 
        [p.title, p.description, p.image, p.is_featured]);
    });
  }

  if (!db.exec("SELECT 1 FROM skills LIMIT 1").length) {
    const skills = [
      { name: "HTML/CSS", proficiency: 90 },
      { name: "JavaScript", proficiency: 85 },
      { name: "SQL", proficiency: 80 },
      { name: "PHP", proficiency: 75 }
    ];
    skills.forEach(s => {
      db.run("INSERT INTO skills (name, proficiency) VALUES (?, ?)", 
        [s.name, s.proficiency]);
    });
  }

  if (!db.exec("SELECT 1 FROM testimonials LIMIT 1").length) {
    const testimonials = [
      { quote: "Excellent work!", author: "Syed Ahmed", role: "CEO at TechNova Corp" },
      { quote: "Highly recommended!", author: "Saad Shah", role: "CTO at TechHub Inc" }
    ];
    testimonials.forEach(t => {
      db.run("INSERT INTO testimonials (quote, author, role) VALUES (?, ?, ?)", 
        [t.quote, t.author, t.role]);
    });
  }
}

// Database functions
function getFeaturedProjects() {
  const stmt = db.prepare("SELECT * FROM projects WHERE is_featured = 1");
  const projects = [];
  while (stmt.step()) projects.push(stmt.getAsObject());
  stmt.free();
  return projects;
}

function getAllProjects() {
  const stmt = db.prepare("SELECT * FROM projects");
  const projects = [];
  while (stmt.step()) projects.push(stmt.getAsObject());
  stmt.free();
  return projects;
}

function getAllSkills() {
  const stmt = db.prepare("SELECT * FROM skills");
  const skills = [];
  while (stmt.step()) skills.push(stmt.getAsObject());
  stmt.free();
  return skills;
}

function getAllTestimonials() {
  const stmt = db.prepare("SELECT * FROM testimonials");
  const testimonials = [];
  while (stmt.step()) testimonials.push(stmt.getAsObject());
  stmt.free();
  return testimonials;
}

function saveMessage(name, email, message) {
  db.run("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)", 
    [name, email, message]);
}