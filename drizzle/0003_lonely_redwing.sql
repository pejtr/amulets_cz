CREATE TABLE `chatbot_conversions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int,
	`variantId` int NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`conversionType` varchar(50) NOT NULL,
	`conversionSubtype` varchar(100),
	`conversionValue` decimal(10,2),
	`currency` varchar(3) DEFAULT 'CZK',
	`productId` varchar(100),
	`productName` varchar(255),
	`affiliatePartner` varchar(50),
	`referralUrl` varchar(500),
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatbot_conversions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chatbot_conversions` ADD CONSTRAINT `chatbot_conversions_sessionId_chatbot_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chatbot_sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_conversions` ADD CONSTRAINT `chatbot_conversions_variantId_chatbot_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `chatbot_variants`(`id`) ON DELETE no action ON UPDATE no action;