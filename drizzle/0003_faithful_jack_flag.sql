CREATE TABLE `reading_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`userId` int,
	`articleSlug` varchar(255) NOT NULL,
	`articleType` varchar(50) NOT NULL DEFAULT 'magazine',
	`articleCategory` varchar(100),
	`readTimeSeconds` int NOT NULL DEFAULT 0,
	`scrollDepthPercent` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`referrerSource` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reading_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `reading_history` ADD CONSTRAINT `reading_history_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;