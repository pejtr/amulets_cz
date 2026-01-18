CREATE TABLE `chatbot_ticket_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`responseType` enum('email','chat','internal_note') NOT NULL,
	`content` text NOT NULL,
	`senderType` enum('ai','operator','customer') NOT NULL,
	`senderName` varchar(100),
	`emailSent` boolean DEFAULT false,
	`emailSentAt` timestamp,
	`emailOpenedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatbot_ticket_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatbot_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`variantId` int,
	`sessionId` int,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`message` text NOT NULL,
	`conversationHistory` text,
	`status` enum('pending','processing','answered','closed') NOT NULL DEFAULT 'pending',
	`priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
	`response` text,
	`respondedAt` timestamp,
	`respondedBy` varchar(100),
	`sourcePage` varchar(500),
	`device` varchar(20),
	`browser` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatbot_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chatbot_ticket_responses` ADD CONSTRAINT `chatbot_ticket_responses_ticketId_chatbot_tickets_id_fk` FOREIGN KEY (`ticketId`) REFERENCES `chatbot_tickets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_tickets` ADD CONSTRAINT `chatbot_tickets_variantId_chatbot_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `chatbot_variants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbot_tickets` ADD CONSTRAINT `chatbot_tickets_sessionId_chatbot_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chatbot_sessions`(`id`) ON DELETE no action ON UPDATE no action;