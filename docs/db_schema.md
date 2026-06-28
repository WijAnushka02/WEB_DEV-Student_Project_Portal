@startuml buildboard-erd

!define PRIMARY_KEY(x) <b><color:#534AB7>x</color></b>
!define FOREIGN_KEY(x) <color:#0F6E56>x</color>
!define NOT_NULL(x) <b>x</b>

skinparam linetype ortho
skinparam roundcorner 8
skinparam defaultFontName Arial
skinparam defaultFontSize 12

skinparam class {
  BackgroundColor #EEEDFE
  BorderColor #534AB7
  ArrowColor #534AB7
  HeaderBackgroundColor #FFFFFF
  HeaderFontColor #000000
  HeaderFontSize 13
  HeaderFontStyle bold
  AttributeFontSize 12
  AttributeFontColor #3C3489
}

entity "users" as users {
  PRIMARY_KEY(id) : INT <<autoincrement>>
  --
  NOT_NULL(name) : VARCHAR
  NOT_NULL(email) : VARCHAR <<unique>>
  profile_pic : VARCHAR
  NOT_NULL(role) : VARCHAR <<default: student>>
  NOT_NULL(google_id) : VARCHAR <<unique>>
  NOT_NULL(created_at) : TIMESTAMP
  NOT_NULL(updated_at) : TIMESTAMP
}

entity "projects" as projects {
  PRIMARY_KEY(id) : INT <<autoincrement>>
  --
  FOREIGN_KEY(user_id) : INT <<FK>>
  NOT_NULL(title) : VARCHAR
  NOT_NULL(description) : TEXT
  thumbnail_url : VARCHAR
  github_url : VARCHAR
  demo_url : VARCHAR
  tech_stack : JSONB
  NOT_NULL(status) : VARCHAR <<default: draft>>
  NOT_NULL(view_count) : INTEGER <<default: 0>>
  NOT_NULL(created_at) : TIMESTAMP
  NOT_NULL(updated_at) : TIMESTAMP
}

entity "likes" as likes {
  PRIMARY_KEY(id) : INT <<autoincrement>>
  --
  FOREIGN_KEY(user_id) : INT <<FK>>
  FOREIGN_KEY(project_id) : INT <<FK>>
  NOT_NULL(created_at) : TIMESTAMP
}

entity "followers" as followers {
  PRIMARY_KEY(id) : INT <<autoincrement>>
  --
  FOREIGN_KEY(follower_id) : INT <<FK>>
  FOREIGN_KEY(following_id) : INT <<FK>>
  NOT_NULL(created_at) : TIMESTAMP
}

entity "notifications" as notifications {
  PRIMARY_KEY(id) : INT <<autoincrement>>
  --
  FOREIGN_KEY(recipient_id) : INT <<FK>>
  FOREIGN_KEY(actor_id) : INT <<FK>>
  FOREIGN_KEY(project_id) : INT <<FK, nullable>>
  NOT_NULL(type) : VARCHAR
  NOT_NULL(message) : TEXT
  NOT_NULL(is_read) : BOOLEAN <<default: false>>
  read_at : TIMESTAMP
  NOT_NULL(created_at) : TIMESTAMP
}

entity "project_tags" as project_tags {
  PRIMARY_KEY(id) : INT <<autoincrement>>
  --
  FOREIGN_KEY(project_id) : INT <<FK>>
  NOT_NULL(tag) : VARCHAR
}

entity "sessions" as sessions {
  PRIMARY_KEY(id) : INT <<autoincrement>>
  --
  FOREIGN_KEY(user_id) : INT <<FK>>
  NOT_NULL(token) : VARCHAR <<unique>>
  NOT_NULL(expires_at) : TIMESTAMP
  NOT_NULL(created_at) : TIMESTAMP
}

' ── Relationships ──────────────────────────────────────

users          ||--o{ projects       : "owns"
users          ||--o{ likes          : "gives"
users          ||--o{ sessions       : "has"
users          ||--o{ notifications  : "receives (recipient)"
users          ||--o{ notifications  : "triggers (actor)"

projects       ||--o{ likes          : "receives"
projects       ||--o{ project_tags   : "tagged with"
projects       ||--o{ notifications  : "referenced in"

users          ||--o{ followers      : "is followed by (following_id)"
users          ||--o{ followers      : "follows (follower_id)"

@enduml