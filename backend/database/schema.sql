CREATE DATABASE news_credibility;

USE news_credibility;


CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE news_analysis (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    prediction VARCHAR(20),
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
    REFERENCES users(user_id)
);


CREATE TABLE analysis_cache (
    cache_id INT AUTO_INCREMENT PRIMARY KEY,
    content_hash VARCHAR(255) UNIQUE,
    result VARCHAR(20),
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
