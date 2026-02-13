CREATE TABLE `ebook_downloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`ebookType` varchar(100) NOT NULL DEFAULT '7-kroku-k-rovnovaze',
	`sourcePage` varchar(500),
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`ctaVariant` varchar(50),
	`emailSent` boolean NOT NULL DEFAULT false,
	`emailSentAt` timestamp,
	`convertedToClient` boolean NOT NULL DEFAULT false,
	`conversionDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ebook_downloads_id` PRIMARY KEY(`id`)
);
