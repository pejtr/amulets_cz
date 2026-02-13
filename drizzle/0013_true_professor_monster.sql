CREATE TABLE `horoscope_generation_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`weekStart` date NOT NULL,
	`weekEnd` date NOT NULL,
	`status` enum('started','in_progress','completed','partial','failed') NOT NULL,
	`totalSigns` int NOT NULL DEFAULT 12,
	`completedSigns` int NOT NULL DEFAULT 0,
	`failedSigns` text,
	`errorMessage` text,
	`duration` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `horoscope_generation_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `horoscope_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(100),
	`zodiacSign` varchar(20),
	`userId` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`confirmedAt` timestamp,
	`unsubscribedAt` timestamp,
	`emailsSent` int NOT NULL DEFAULT 0,
	`emailsOpened` int NOT NULL DEFAULT 0,
	`lastSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `horoscope_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `horoscope_subscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `planetary_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventDate` date NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`planet` varchar(30),
	`titleCs` varchar(200) NOT NULL,
	`descriptionCs` text,
	`zodiacSign` varchar(20),
	`aspectType` varchar(50),
	`importance` enum('low','medium','high','critical') DEFAULT 'medium',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `planetary_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weekly_horoscopes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`zodiacSign` varchar(20) NOT NULL,
	`weekStart` date NOT NULL,
	`weekEnd` date NOT NULL,
	`overallRating` int NOT NULL,
	`loveRating` int NOT NULL,
	`careerRating` int NOT NULL,
	`financeRating` int NOT NULL,
	`healthRating` int NOT NULL,
	`overallText` text NOT NULL,
	`loveText` text NOT NULL,
	`careerText` text NOT NULL,
	`financeText` text NOT NULL,
	`healthText` text NOT NULL,
	`luckyDays` text,
	`luckyNumbers` text,
	`luckyColor` varchar(50),
	`luckyStone` varchar(100),
	`planetaryInfluences` text,
	`metaTitle` varchar(70),
	`metaDescription` varchar(160),
	`published` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weekly_horoscopes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `horoscope_subscriptions` ADD CONSTRAINT `horoscope_subscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;