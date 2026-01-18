CREATE TABLE `chatbot_daily_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variantId` int NOT NULL,
	`date` timestamp NOT NULL,
	`totalSessions` int NOT NULL DEFAULT 0,
	`totalMessages` int NOT NULL DEFAULT 0,
	`totalUserMessages` int NOT NULL DEFAULT 0,
	`totalBotMessages` int NOT NULL DEFAULT 0,
	`avgSessionDuration` int NOT NULL DEFAULT 0,
	`avgMessagesPerSession` decimal(5,2) DEFAULT '0',
	`totalCategoryClicks` int NOT NULL DEFAULT 0,
	`totalQuestionClicks` int NOT NULL DEFAULT 0,
	`totalConversions` int NOT NULL DEFAULT 0,
	`totalConversionValue` decimal(12,2) DEFAULT '0',
	`conversionRate` decimal(5,4) DEFAULT '0',
	`totalBounces` int NOT NULL DEFAULT 0,
	`bounceRate` decimal(5,4) DEFAULT '0',
	`positiveSentimentCount` int NOT NULL DEFAULT 0,
	`negativeSentimentCount` int NOT NULL DEFAULT 0,
	`neutralSentimentCount` int NOT NULL DEFAULT 0,
	`avgSatisfactionScore` decimal(3,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatbot_daily_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatbot_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int,
	`variantId` int,
	`visitorId` varchar(64) NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`eventData` text,
	`page` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatbot_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatbot_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`variantId` int NOT NULL,
	`role` varchar(20) NOT NULL,
	`content` text NOT NULL,
	`responseTime` int,
	`tokenCount` int,
	`clickedCategory` varchar(50),
	`clickedQuestion` varchar(200),
	`sentiment` varchar(20),
	`intent` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatbot_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatbot_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`variantId` int NOT NULL,
	`userId` int,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`duration` int,
	`sourcePage` varchar(500),
	`referrer` varchar(500),
	`device` varchar(50),
	`browser` varchar(100),
	`messageCount` int NOT NULL DEFAULT 0,
	`userMessageCount` int NOT NULL DEFAULT 0,
	`botMessageCount` int NOT NULL DEFAULT 0,
	`categoryClicks` int NOT NULL DEFAULT 0,
	`questionClicks` int NOT NULL DEFAULT 0,
	`converted` boolean NOT NULL DEFAULT false,
	`conversionType` varchar(50),
	`conversionValue` decimal(10,2),
	`overallSentiment` varchar(20),
	`satisfactionScore` int,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatbot_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `chatbot_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `chatbot_variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variantKey` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`avatarUrl` varchar(500),
	`personalityPrompt` text NOT NULL,
	`initialMessage` text NOT NULL,
	`colorScheme` varchar(50),
	`targetAudience` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	`weight` int NOT NULL DEFAULT 25,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatbot_variants_id` PRIMARY KEY(`id`),
	CONSTRAINT `chatbot_variants_variantKey_unique` UNIQUE(`variantKey`)
);
--> statement-breakpoint
ALTER TABLE `chatbot_daily_stats` ADD CONSTRAINT `chatbot_daily_stats_variantId_chatbot_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `chatbot_variants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_events` ADD CONSTRAINT `chatbot_events_sessionId_chatbot_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chatbot_sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_events` ADD CONSTRAINT `chatbot_events_variantId_chatbot_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `chatbot_variants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_messages` ADD CONSTRAINT `chatbot_messages_sessionId_chatbot_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chatbot_sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_messages` ADD CONSTRAINT `chatbot_messages_variantId_chatbot_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `chatbot_variants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_sessions` ADD CONSTRAINT `chatbot_sessions_variantId_chatbot_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `chatbot_variants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_sessions` ADD CONSTRAINT `chatbot_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;