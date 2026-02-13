CREATE TABLE `lunar_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`visitorId` varchar(64),
	`birthDate` date NOT NULL,
	`birthTime` time,
	`birthPlace` varchar(200),
	`moonPhase` varchar(50) NOT NULL,
	`moonPhaseEmoji` varchar(10) NOT NULL,
	`lifePathNumber` int NOT NULL,
	`profileData` text NOT NULL,
	`isPremium` boolean NOT NULL DEFAULT false,
	`premiumProfileData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lunar_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monthly_forecasts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lunarProfileId` int NOT NULL,
	`forecastMonth` int NOT NULL,
	`forecastYear` int NOT NULL,
	`forecastData` text NOT NULL,
	`viewed` boolean NOT NULL DEFAULT false,
	`viewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `monthly_forecasts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `premium_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('active','cancelled','expired','trial') NOT NULL DEFAULT 'trial',
	`plan` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
	`priceAmount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'CZK',
	`currentPeriodStart` timestamp NOT NULL,
	`currentPeriodEnd` timestamp NOT NULL,
	`cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
	`cancelledAt` timestamp,
	`paymentMethod` varchar(50),
	`lastPaymentAt` timestamp,
	`nextPaymentAt` timestamp,
	`trialEndsAt` timestamp,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `premium_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ritual_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lunarProfileId` int NOT NULL,
	`ritualType` varchar(100) NOT NULL,
	`ritualName` varchar(200) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	`mood` enum('very_bad','bad','neutral','good','very_good'),
	`moonPhaseAtCompletion` varchar(50),
	CONSTRAINT `ritual_completions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `lunar_profiles` ADD CONSTRAINT `lunar_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_forecasts` ADD CONSTRAINT `monthly_forecasts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_forecasts` ADD CONSTRAINT `monthly_forecasts_lunarProfileId_lunar_profiles_id_fk` FOREIGN KEY (`lunarProfileId`) REFERENCES `lunar_profiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `premium_subscriptions` ADD CONSTRAINT `premium_subscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ritual_completions` ADD CONSTRAINT `ritual_completions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ritual_completions` ADD CONSTRAINT `ritual_completions_lunarProfileId_lunar_profiles_id_fk` FOREIGN KEY (`lunarProfileId`) REFERENCES `lunar_profiles`(`id`) ON DELETE cascade ON UPDATE no action;