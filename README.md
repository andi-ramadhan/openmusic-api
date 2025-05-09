Certainly! Here's a comprehensive and user-friendly documentation for your OpenMusic API project, designed to guide developers through setup, usage, and contribution.

---

# 🎵 OpenMusic API Documentation

OpenMusic API is a RESTful back-end service designed for managing music-related data, including albums, songs, users, playlists, and social features. Built with Hapi.js, it offers a modular architecture with robust features like JWT authentication, Redis caching, and RabbitMQ-based asynchronous processing.([GitHub][1])

---

## 📁 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [API Endpoints](#api-endpoints)
6. [Setup Instructions](#setup-instructions)
7. [Deployment](#deployment)
8. [Contribution Guidelines](#contribution-guidelines)
9. [License](#license)

---

## 🧭 Overview

* **Purpose**: To provide a scalable and modular back-end service for a music streaming application.
* **Key Functionalities**:

  * User authentication and management
  * Album and song CRUD operations
  * Playlist creation and collaboration
  * Activity tracking
  * Album cover uploads
  * Album likes with caching
  * Playlist export via RabbitMQ([GitHub][2], [Open Music Initiative][3], [GitHub][1])

---

## 🏗️ Architecture

### Modular Plugin-Based Structure

The system is organized into domain-specific plugins, each encapsulating related functionalities. This modularity ensures scalability and maintainability.

### Core Components

* **Server Configuration**: Handles CORS, JWT authentication, and centralized error handling.
* **Service Layer**: Contains business logic for each domain, instantiated during server initialization.
* **External Integrations**:

  * **Redis**: Caching album likes.
  * **RabbitMQ**: Handling asynchronous playlist exports.
  * **Local Storage**: Managing album cover uploads.([GitHub][1])

---

## ✨ Features

1. **User Management**: Registration and authentication using JWT.
2. **Album Management**: CRUD operations for albums.
3. **Song Management**: CRUD operations for songs, with album associations.
4. **Playlist Management**: Create, view, and delete playlists; add or remove songs.
5. **Collaboration**: Share playlists with other users.
6. **Activity Tracking**: Record actions performed on playlists.
7. **Album Covers**: Upload and retrieve album cover images.
8. **Likes System**: Like albums with cached counts using Redis.
9. **Export Functionality**: Asynchronous playlist export via RabbitMQ.([GitHub][2], [GitHub][1])

---

## 🛠️ Technologies Used

| Technology | Purpose                                  |               |
| ---------- | ---------------------------------------- | ------------- |
| Hapi.js    | Web framework for API endpoints          |               |
| PostgreSQL | Relational database for data persistence |               |
| Redis      | In-memory data store for caching         |               |
| RabbitMQ   | Message broker for asynchronous tasks    |               |
| JWT        | Authentication mechanism                 |               |
| Joi        | Request payload validation               |               |
| Bcrypt     | Password hashing                         |               |
| Node.js    | Runtime environment                      | ([GitHub][1]) |

---

## 📚 API Endpoints

### User Endpoints

* `POST /users`: Register a new user.
* `POST /authentications`: Log in an existing user.
* `PUT /authentications`: Refresh an existing user's session token.
* `DELETE /authentications`: Delete refresh token.([GitHub][2], [GitHub][1])

### Album Endpoints

* `POST /albums`: Add a new album.
* `GET /albums/{id}`: View an album.
* `PUT /albums/{id}`: Update an album.
* `DELETE /albums/{id}`: Delete an album.
* `POST /albums/{id}/likes`: Like an album.
* `GET /albums/{id}/likes`: View likes of the album.([GitHub][1], [GitHub][2])

### Song Endpoints

* `POST /songs`: Add a new song.
* `GET /songs`: View all songs.
* `GET /songs/{id}`: View a song.
* `PUT /songs/{id}`: Update a song.
* `DELETE /songs/{id}`: Delete a song.([GitHub][1])

### Playlist Endpoints

* `POST /playlists`: Add a new playlist.
* `GET /playlists`: View playlists.
* `DELETE /playlists/{id}`: Delete a playlist.
* `POST /playlists/{id}/songs`: Add song to playlist.
* `GET /playlists/{id}/songs`: View songs in playlist.
* `DELETE /playlists/{id}/songs`: Remove song from playlist.
* `GET /playlists/{id}/activities`: View playlist activities.([GitHub][1], [Wikipedia][4])

### Collaboration Endpoints

* `POST /collaborations`: Add playlist collaborator.
* `DELETE /collaborations`: Remove playlist collaborator.([GitHub][1])

### Export & Upload Endpoints

* `POST /export/playlists/{playlistId}`: Export a playlist.
* `POST /albums/{id}/covers`: Upload an album image.
* `GET /upload/{param*}`: Retrieve an album image.([GitHub][1])

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (v14.16.1)
* PostgreSQL
* Redis
* RabbitMQ([GitHub][1])

### Installation Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/andi-ramadhan/openmusic-api.git
   cd openmusic-api
   ```



2. **Install Dependencies**:

   ```bash
   npm install
   ```



3. **Configure Environment Variables**:

   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```



4. **Run Database Migrations**:

   ```bash
   npm run migrate up
   ```



5. **Start the Development Server**:

   ```bash
   npm run start-dev
   ```



---

## 🚀 Deployment

For production deployment:([support.ircam.fr][5])

1. **Build the Project**:

   ```bash
   npm run build
   ```



2. **Start the Server**:

   ```bash
   npm start
   ```



Ensure all environment variables are correctly set in your production environment.

---

## 🤝 Contribution Guidelines

1. **Fork the Repository**: Create your own fork of the project.
2. **Create a Feature Branch**: `git checkout -b feature/YourFeature`
3. **Commit Your Changes**: `git commit -m 'Add YourFeature'`
4. **Push to the Branch**: `git push origin feature/YourFeature`
5. **Open a Pull Request**: Submit your PR for review.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/andi-ramadhan/openmusic-api/blob/main/LICENSE) file for details.

---

For more detailed information, visit the [DeepWiki Documentation](https://deepwiki.com/andi-ramadhan/openmusic-api).

Feel free to reach out if you have any questions or need further assistance!

[1]: https://github.com/androsyahreza/openmusic-api?utm_source=chatgpt.com "androsyz/openmusic-api - GitHub"
[2]: https://github.com/AxelSeanCP/OpenMusic-API?utm_source=chatgpt.com "AxelSeanCP/OpenMusic-API: A project from Dicoding's Back End ..."
[3]: https://open-music.org/our-api?utm_source=chatgpt.com "Our API - Open Music Initiative"
[4]: https://pt.wikipedia.org/wiki/OpenMusic?utm_source=chatgpt.com "OpenMusic"
[5]: https://support.ircam.fr/docs/om/om6-manual/co/OM-Documentation.html?utm_source=chatgpt.com "Guide - OpenMusic Documentation - Ircam"
