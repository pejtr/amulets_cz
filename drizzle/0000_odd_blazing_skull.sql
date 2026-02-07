ALTER TABLE `article_views` MODIFY COLUMN `device` varchar(200);--> statement-breakpoint
ALTER TABLE `article_views` ADD `activeReadTimeSeconds` int;--> statement-breakpoint
ALTER TABLE `article_views` ADD `interactionCount` int;--> statement-breakpoint
ALTER TABLE `article_views` ADD `orientationChanges` int;