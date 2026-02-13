CREATE TABLE `content_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int,
	`title` varchar(200) NOT NULL,
	`contentType` enum('article','product','guide','faq','video') NOT NULL,
	`description` text,
	`keywords` text,
	`priority` enum('low','medium','high','critical') DEFAULT 'medium',
	`demandScore` int DEFAULT 0,
	`reason` text,
	`status` enum('suggested','approved','in_progress','completed','rejected') DEFAULT 'suggested',
	`implementedAt` timestamp,
	`implementedUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_suggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demand_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportType` enum('daily','weekly','monthly') NOT NULL,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`totalConversations` int DEFAULT 0,
	`totalMessages` int DEFAULT 0,
	`uniqueTopics` int DEFAULT 0,
	`contentGaps` int DEFAULT 0,
	`topTopics` text,
	`topProducts` text,
	`topQuestions` text,
	`recommendations` text,
	`contentSuggestions` text,
	`status` enum('generating','ready','sent','archived') DEFAULT 'generating',
	`sentToTelegram` boolean DEFAULT false,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `demand_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `detected_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int,
	`messageId` int,
	`topic` varchar(200) NOT NULL,
	`categoryId` int,
	`sentiment` enum('positive','neutral','negative') DEFAULT 'neutral',
	`intent` enum('question','purchase','complaint','feedback','other') DEFAULT 'question',
	`urgency` enum('low','medium','high') DEFAULT 'medium',
	`relatedProduct` varchar(200),
	`contentGap` boolean DEFAULT false,
	`suggestedContent` text,
	`confidence` decimal(5,2),
	`extractedKeywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `detected_topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `topic_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`parentId` int,
	`icon` varchar(10),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `topic_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `topic_categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `content_suggestions` ADD CONSTRAINT `content_suggestions_reportId_demand_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `demand_reports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `detected_topics` ADD CONSTRAINT `detected_topics_sessionId_chatbot_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chatbot_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `detected_topics` ADD CONSTRAINT `detected_topics_messageId_chatbot_messages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `chatbot_messages`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `detected_topics` ADD CONSTRAINT `detected_topics_categoryId_topic_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `topic_categories`(`id`) ON DELETE no action ON UPDATE no action;