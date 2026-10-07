CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`car` text NOT NULL,
	`address` text NOT NULL,
	`service` text NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`comment` text DEFAULT '' NOT NULL,
	`created` integer NOT NULL,
	`request_key` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_request_key_unique` ON `bookings` (`request_key`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`sent` integer DEFAULT 0 NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`stars` integer NOT NULL,
	`comment` text NOT NULL,
	`consent` integer NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`created` integer NOT NULL
);
