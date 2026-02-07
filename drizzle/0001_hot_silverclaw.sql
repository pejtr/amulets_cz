CREATE TABLE `article_headline_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleSlug` varchar(255) NOT NULL,
	`variantKey` varchar(50) NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`clicked` boolean NOT NULL DEFAULT false,
	`readTimeSeconds` int DEFAULT 0,
	`scrollDepthPercent` int DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `article_headline_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `article_headline_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleSlug` varchar(255) NOT NULL,
	`articleType` varchar(50) NOT NULL DEFAULT 'magazine',
	`variantKey` varchar(50) NOT NULL,
	`headline` varchar(500) NOT NULL,
	`isControl` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`impressions` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`totalReadTime` int NOT NULL DEFAULT 0,
	`totalScrollDepth` int NOT NULL DEFAULT 0,
	`completions` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `article_headline_tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `article_views` MODIFY COLUMN `device` varchar(200);--> statement-breakpoint
ALTER TABLE `article_views` ADD `activeReadTimeSeconds` int;--> statement-breakpoint
ALTER TABLE `article_views` ADD `interactionCount` int;--> statement-breakpoint
ALTER TABLE `article_views` ADD `orientationChanges` int;