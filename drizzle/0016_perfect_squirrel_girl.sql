CREATE TABLE `offline_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320),
	`message` text NOT NULL,
	`conversationHistory` json,
	`browsingContext` json,
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`readBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offline_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `offline_messages` ADD CONSTRAINT `offline_messages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `offline_messages` ADD CONSTRAINT `offline_messages_readBy_users_id_fk` FOREIGN KEY (`readBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;