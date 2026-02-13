CREATE TABLE `shared_user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`personalityType` varchar(50),
	`interests` text,
	`purchaseHistory` text,
	`preferredProducts` text,
	`communicationStyle` varchar(50),
	`engagementLevel` varchar(20),
	`lastInteractionProject` varchar(50),
	`crossProjectScore` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shared_user_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectName` varchar(50) NOT NULL,
	`interactionType` varchar(50) NOT NULL,
	`content` text,
	`sentiment` varchar(20),
	`category` varchar(50),
	`duration` int,
	`result` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_interactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `shared_user_profiles` ADD CONSTRAINT `shared_user_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_interactions` ADD CONSTRAINT `user_interactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;