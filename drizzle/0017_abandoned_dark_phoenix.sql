CREATE TABLE `article_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleSlug` varchar(200) NOT NULL,
	`articleType` enum('magazine','guide','tantra') NOT NULL DEFAULT 'magazine',
	`visitorId` varchar(64),
	`userId` int,
	`authorName` varchar(100) NOT NULL,
	`authorEmail` varchar(320),
	`content` text NOT NULL,
	`parentId` int,
	`status` enum('pending','approved','rejected','spam') NOT NULL DEFAULT 'pending',
	`moderatedBy` varchar(100),
	`moderatedAt` timestamp,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `article_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `article_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleSlug` varchar(200) NOT NULL,
	`articleType` enum('magazine','guide','tantra') NOT NULL DEFAULT 'magazine',
	`visitorId` varchar(64) NOT NULL,
	`userId` int,
	`rating` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `article_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `article_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleSlug` varchar(200) NOT NULL,
	`articleType` enum('magazine','guide','tantra') NOT NULL DEFAULT 'magazine',
	`visitorId` varchar(64) NOT NULL,
	`userId` int,
	`referrer` varchar(500),
	`sourcePage` varchar(500),
	`device` varchar(50),
	`readTimeSeconds` int,
	`scrollDepthPercent` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `article_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `article_comments` ADD CONSTRAINT `article_comments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `article_ratings` ADD CONSTRAINT `article_ratings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `article_views` ADD CONSTRAINT `article_views_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;