CREATE TABLE `membership_activity_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`membershipId` int NOT NULL,
	`activityType` enum('joined','upgraded','downgraded','cancelled','renewed','payment_success','payment_failed','added_to_group','removed_from_group','ohorai_synced') NOT NULL,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `membership_activity_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `membership_tiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tierKey` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`priceMonthly` int NOT NULL DEFAULT 0,
	`priceYearly` int NOT NULL DEFAULT 0,
	`priceLifetime` int NOT NULL DEFAULT 0,
	`benefits` text,
	`telegramGroupLink` varchar(255),
	`telegramGroupChatId` varchar(50),
	`ohoraiDiscount` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`isInviteOnly` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `membership_tiers_id` PRIMARY KEY(`id`),
	CONSTRAINT `membership_tiers_tierKey_unique` UNIQUE(`tierKey`)
);
--> statement-breakpoint
CREATE TABLE `user_memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320),
	`telegramId` varchar(50),
	`telegramUsername` varchar(100),
	`tierId` int NOT NULL,
	`status` enum('active','cancelled','expired','pending') NOT NULL DEFAULT 'pending',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`cancelledAt` timestamp,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`lastPaymentAt` timestamp,
	`ohoraiSynced` boolean NOT NULL DEFAULT false,
	`ohoraiSyncedAt` timestamp,
	`addedToGroup` boolean NOT NULL DEFAULT false,
	`addedToGroupAt` timestamp,
	`source` enum('website','telegram','ohorai','manual') NOT NULL DEFAULT 'website',
	`referredBy` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vip_invite_uses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inviteId` int NOT NULL,
	`userId` int,
	`telegramId` varchar(50),
	`telegramUsername` varchar(100),
	`usedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vip_invite_uses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vip_invites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inviteCode` varchar(50) NOT NULL,
	`createdByUserId` int,
	`createdByName` varchar(100),
	`maxUses` int NOT NULL DEFAULT 1,
	`usedCount` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vip_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `vip_invites_inviteCode_unique` UNIQUE(`inviteCode`)
);
--> statement-breakpoint
ALTER TABLE `membership_activity_log` ADD CONSTRAINT `membership_activity_log_membershipId_user_memberships_id_fk` FOREIGN KEY (`membershipId`) REFERENCES `user_memberships`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_memberships` ADD CONSTRAINT `user_memberships_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_memberships` ADD CONSTRAINT `user_memberships_tierId_membership_tiers_id_fk` FOREIGN KEY (`tierId`) REFERENCES `membership_tiers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vip_invite_uses` ADD CONSTRAINT `vip_invite_uses_inviteId_vip_invites_id_fk` FOREIGN KEY (`inviteId`) REFERENCES `vip_invites`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vip_invite_uses` ADD CONSTRAINT `vip_invite_uses_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vip_invites` ADD CONSTRAINT `vip_invites_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;