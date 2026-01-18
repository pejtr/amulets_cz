CREATE TABLE `affiliate_campaigns` (
	`id` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`baseUrl` varchar(255) NOT NULL,
	`aAid` varchar(50) NOT NULL,
	`aBid` varchar(50) NOT NULL,
	`category` enum('fashion','jewelry','lifestyle','wellness','food','other') NOT NULL,
	`relevance` enum('high','medium','low') NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`totalClicks` int DEFAULT 0,
	`totalConversions` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliate_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` varchar(50) NOT NULL,
	`targetUrl` varchar(500) NOT NULL,
	`source` enum('chatbot','product_page','recommendation','email') NOT NULL,
	`sessionId` varchar(100),
	`userId` int,
	`userAgent` text,
	`ipAddress` varchar(45),
	`clickedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_clicks_id` PRIMARY KEY(`id`)
);
