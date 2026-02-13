CREATE TABLE `project_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(50) NOT NULL,
	`projectName` varchar(100) NOT NULL,
	`date` date NOT NULL,
	`pageViews` int NOT NULL DEFAULT 0,
	`uniqueVisitors` int NOT NULL DEFAULT 0,
	`sessions` int NOT NULL DEFAULT 0,
	`avgSessionDuration` int NOT NULL DEFAULT 0,
	`bounceRate` int NOT NULL DEFAULT 0,
	`chatSessions` int DEFAULT 0,
	`chatMessages` int DEFAULT 0,
	`chatConversions` int DEFAULT 0,
	`emailCaptures` int DEFAULT 0,
	`affiliateClicks` int DEFAULT 0,
	`purchases` int DEFAULT 0,
	`revenue` int DEFAULT 0,
	`topPages` text,
	`topCountries` text,
	`customEvents` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_stats_aggregated` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`totalPageViews` int NOT NULL DEFAULT 0,
	`totalUniqueVisitors` int NOT NULL DEFAULT 0,
	`totalSessions` int NOT NULL DEFAULT 0,
	`totalChatSessions` int NOT NULL DEFAULT 0,
	`totalChatMessages` int NOT NULL DEFAULT 0,
	`totalConversions` int NOT NULL DEFAULT 0,
	`totalRevenue` int NOT NULL DEFAULT 0,
	`projectsData` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_stats_aggregated_id` PRIMARY KEY(`id`)
);
