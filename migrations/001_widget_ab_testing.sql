-- Widget A/B Testing Tables Migration
-- Created: 2026-02-13

-- Widget Variants - různé verze UI widgetů
CREATE TABLE IF NOT EXISTS `widget_variants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `widgetKey` VARCHAR(100) NOT NULL,
  `variantKey` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `config` JSON NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `weight` INT NOT NULL DEFAULT 50,
  `isControl` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100),
  `notes` TEXT,
  INDEX `idx_widget_key` (`widgetKey`),
  INDEX `idx_variant_key` (`variantKey`),
  INDEX `idx_is_active` (`isActive`),
  UNIQUE KEY `unique_widget_variant` (`widgetKey`, `variantKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Widget Impressions - zobrazení widgetu
CREATE TABLE IF NOT EXISTS `widget_impressions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `variantId` INT NOT NULL,
  `widgetKey` VARCHAR(100) NOT NULL,
  `variantKey` VARCHAR(100) NOT NULL,
  `visitorId` VARCHAR(64) NOT NULL,
  `sessionId` VARCHAR(64),
  `userId` INT,
  `page` VARCHAR(500) NOT NULL,
  `referrer` VARCHAR(500),
  `device` VARCHAR(50),
  `browser` VARCHAR(100),
  `language` VARCHAR(10),
  `viewDuration` INT,
  `scrollDepth` INT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_variant_id` (`variantId`),
  INDEX `idx_visitor_id` (`visitorId`),
  INDEX `idx_session_id` (`sessionId`),
  INDEX `idx_created_at` (`createdAt`),
  FOREIGN KEY (`variantId`) REFERENCES `widget_variants`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Widget Interactions - interakce s widgetem
CREATE TABLE IF NOT EXISTS `widget_interactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `impressionId` INT,
  `variantId` INT NOT NULL,
  `widgetKey` VARCHAR(100) NOT NULL,
  `variantKey` VARCHAR(100) NOT NULL,
  `visitorId` VARCHAR(64) NOT NULL,
  `sessionId` VARCHAR(64),
  `interactionType` VARCHAR(50) NOT NULL,
  `interactionTarget` VARCHAR(100),
  `interactionValue` TEXT,
  `timeToInteraction` INT,
  `metadata` JSON,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_impression_id` (`impressionId`),
  INDEX `idx_variant_id` (`variantId`),
  INDEX `idx_visitor_id` (`visitorId`),
  INDEX `idx_interaction_type` (`interactionType`),
  INDEX `idx_created_at` (`createdAt`),
  FOREIGN KEY (`impressionId`) REFERENCES `widget_impressions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`variantId`) REFERENCES `widget_variants`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Widget Conversions - konverze spojené s widgetem
CREATE TABLE IF NOT EXISTS `widget_conversions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `impressionId` INT,
  `interactionId` INT,
  `variantId` INT NOT NULL,
  `widgetKey` VARCHAR(100) NOT NULL,
  `variantKey` VARCHAR(100) NOT NULL,
  `visitorId` VARCHAR(64) NOT NULL,
  `sessionId` VARCHAR(64),
  `conversionType` VARCHAR(50) NOT NULL,
  `conversionValue` DECIMAL(10, 2),
  `currency` VARCHAR(3) DEFAULT 'CZK',
  `timeToConversion` INT,
  `metadata` JSON,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_impression_id` (`impressionId`),
  INDEX `idx_interaction_id` (`interactionId`),
  INDEX `idx_variant_id` (`variantId`),
  INDEX `idx_visitor_id` (`visitorId`),
  INDEX `idx_conversion_type` (`conversionType`),
  INDEX `idx_created_at` (`createdAt`),
  FOREIGN KEY (`impressionId`) REFERENCES `widget_impressions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`interactionId`) REFERENCES `widget_interactions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`variantId`) REFERENCES `widget_variants`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Widget Daily Stats - denní statistiky
CREATE TABLE IF NOT EXISTS `widget_daily_stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `variantId` INT NOT NULL,
  `widgetKey` VARCHAR(100) NOT NULL,
  `variantKey` VARCHAR(100) NOT NULL,
  `date` TIMESTAMP NOT NULL,
  `totalImpressions` INT NOT NULL DEFAULT 0,
  `uniqueVisitors` INT NOT NULL DEFAULT 0,
  `totalInteractions` INT NOT NULL DEFAULT 0,
  `uniqueInteractors` INT NOT NULL DEFAULT 0,
  `interactionRate` DECIMAL(5, 4) NOT NULL DEFAULT 0,
  `totalConversions` INT NOT NULL DEFAULT 0,
  `uniqueConverters` INT NOT NULL DEFAULT 0,
  `conversionRate` DECIMAL(5, 4) NOT NULL DEFAULT 0,
  `conversionRateFromInteraction` DECIMAL(5, 4) NOT NULL DEFAULT 0,
  `totalConversionValue` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `avgConversionValue` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `avgTimeToInteraction` INT NOT NULL DEFAULT 0,
  `avgTimeToConversion` INT NOT NULL DEFAULT 0,
  `avgViewDuration` INT NOT NULL DEFAULT 0,
  `avgScrollDepth` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_variant_id` (`variantId`),
  INDEX `idx_widget_key` (`widgetKey`),
  INDEX `idx_date` (`date`),
  UNIQUE KEY `unique_variant_date` (`variantId`, `date`),
  FOREIGN KEY (`variantId`) REFERENCES `widget_variants`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Widget AB Test Results - výsledky A/B testů
CREATE TABLE IF NOT EXISTS `widget_ab_test_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `widgetKey` VARCHAR(100) NOT NULL,
  `testName` VARCHAR(255) NOT NULL,
  `startDate` TIMESTAMP NOT NULL,
  `endDate` TIMESTAMP,
  `status` VARCHAR(20) NOT NULL DEFAULT 'running',
  `winnerVariantId` INT,
  `winnerDeclaredAt` TIMESTAMP,
  `winnerConfidence` DECIMAL(5, 4),
  `results` JSON,
  `notes` TEXT,
  `conclusions` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_widget_key` (`widgetKey`),
  INDEX `idx_status` (`status`),
  INDEX `idx_start_date` (`startDate`),
  FOREIGN KEY (`winnerVariantId`) REFERENCES `widget_variants`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
