CREATE TABLE `ohorai_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`hour` int NOT NULL,
	`totalConversations` int DEFAULT 0,
	`totalMessages` int DEFAULT 0,
	`uniqueVisitors` int DEFAULT 0,
	`emailCaptures` int DEFAULT 0,
	`affiliateClicks` int DEFAULT 0,
	`productViews` int DEFAULT 0,
	`avgSessionDuration` int DEFAULT 0,
	`avgMessagesPerSession` int DEFAULT 0,
	`topTopics` text,
	`syncedAt` timestamp NOT NULL DEFAULT (now()),
	`sourceVersion` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ohorai_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ohorai_sync_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`syncType` enum('hourly','daily','manual') NOT NULL,
	`status` enum('success','failed','partial') NOT NULL,
	`recordsReceived` int DEFAULT 0,
	`recordsProcessed` int DEFAULT 0,
	`errorMessage` text,
	`duration` int,
	`syncedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ohorai_sync_log_id` PRIMARY KEY(`id`)
);
