-- ****************** Dialect: MySQL **********************************;
-- ****************** Database: voicebot-business *********************;
-- ****************** Version: 27 *************************************;
-- ********************************************************************;

-- ************************************** `roles`

CREATE TABLE `roles`
(
 `id`        int NOT NULL AUTO_INCREMENT ,
 `role`      varchar(45) NOT NULL ,
 `slug`      varchar(45) NOT NULL ,
 `createdAt` datetime NOT NULL ,
 `updatedAt` datetime NOT NULL ,
 `deletedAt` datetime NULL ,

PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `users`

CREATE TABLE `users`
(
 `id`             char(36) NOT NULL ,
 `username`       varchar(255) NOT NULL ,
 `email`          varchar(255) NOT NULL ,
 `password`       varchar(255) NOT NULL ,
 `picture`        varchar(255) NOT NULL ,
 `google`         int NOT NULL ,
 `is_active`      int NOT NULL ,
 `token`          varchar(255) NULL ,
 `last_login_at`  bigint NOT NULL ,
 `email_verified` int NOT NULL ,
 `rol_id`         int NOT NULL ,
 `createdAt`      datetime NOT NULL ,
 `updatedAt`      datetime NOT NULL ,
 `deletedAt`      datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_role_user` (`rol_id`),
CONSTRAINT `FK_role_user` FOREIGN KEY `fkIdx_role_user` (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `customers`

CREATE TABLE `customers`
(
 `id`                      char(36) NOT NULL ,
 `product`                 varchar(45) NOT NULL ,
 `description`             varchar(45) NOT NULL ,
 `allowance_month`         varchar(45) NOT NULL ,
 `end_date`                varchar(45) NOT NULL ,
 `product_number`          int NOT NULL ,
 `customer_number`         int NOT NULL ,
 `account_number`          varchar(255) NOT NULL ,
 `name`                    varchar(255) NOT NULL ,
 `rfc`                     varchar(45) NOT NULL ,
 `age`                     int NOT NULL ,
 `email`                   varchar(255) NOT NULL ,
 `address`                 varchar(255) NOT NULL ,
 `suburb`                  varchar(100) NOT NULL ,
 `city`                    varchar(100) NOT NULL ,
 `state`                   varchar(45) NOT NULL ,
 `zip`                     int NOT NULL ,
 `balance_due`             double NOT NULL ,
 `total_balance`           double NOT NULL ,
 `last_payment`            double NOT NULL ,
 `last_payment_date`       varchar(45) NOT NULL ,
 `days_past_due`           int NOT NULL ,
 `past_due_payments`       int NOT NULL ,
 `overdue_payment_1`       int NOT NULL ,
 `overdue_payment_2`       int NOT NULL ,
 `overdue_payment_3`       int NOT NULL ,
 `overdue_payment_4`       int NOT NULL ,
 `drawer`                  int NOT NULL ,
 `phone`                   varchar(45) NOT NULL ,
 `landline`                varchar(45) NOT NULL ,
 `cut_date`                varchar(45) NOT NULL ,
 `chainid`                 varchar(25) NULL ,
 `unique_id`               char(36) NULL ,
 `payment_type`            varchar(45) NOT NULL ,
 `is_in_debt`              int NOT NULL ,
 `payment_commitment_date` date NULL ,
 `attempts_counter`        int NULL ,
 `createdAt`               datetime NOT NULL ,
 `updatedAt`               datetime NOT NULL ,
 `deletedAt`               datetime NULL ,

PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `channels`

CREATE TABLE `channels`
(
 `id`        int NOT NULL AUTO_INCREMENT ,
 `channel`   varchar(45) NOT NULL ,
 `createdAt` datetime NOT NULL ,
 `updatedAt` datetime NOT NULL ,
 `deletedAt` datetime NULL ,

PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `email_templates`

CREATE TABLE `email_templates`
(
 `id`        char(36) NOT NULL ,
 `template`  varchar(255) NOT NULL ,
 `createdAt` datetime NOT NULL ,
 `updatedAt` datetime NOT NULL ,
 `deletedAt` datetime NULL ,

PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `contact_actions`

CREATE TABLE `contact_actions`
(
 `id`                char(36) NOT NULL ,
 `message`           varchar(255) NOT NULL ,
 `dispatch_date`     datetime NOT NULL ,
 `status`            int NOT NULL ,
 `whatsapp_template` varchar(512) NULL ,
 `channel_id`        int NOT NULL ,
 `email_template_id` char(36) NULL ,
 `createdAt`         datetime NOT NULL ,
 `updatedAt`         datetime NOT NULL ,
 `deletedAt`         datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_channel_contact_action` (`channel_id`),
CONSTRAINT `FK_channel_contact_action` FOREIGN KEY `fkIdx_channel_contact_action` (`channel_id`) REFERENCES `channels` (`id`),
KEY `fkIdx_email_template_contact_action` (`email_template_id`),
CONSTRAINT `FK_email_template_contact_action` FOREIGN KEY `fkIdx_email_template_contact_action` (`email_template_id`) REFERENCES `email_templates` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `filters`

CREATE TABLE `filters`
(
 `id`                int NOT NULL AUTO_INCREMENT ,
 `filter`            varchar(45) NOT NULL ,
 `condition`         varchar(45) NOT NULL ,
 `rule`              mediumtext NOT NULL ,
 `contact_action_id` char(36) NOT NULL ,
 `createdAt`         datetime NOT NULL ,
 `updatedAt`         datetime NOT NULL ,
 `deletedAt`         datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_contact_action_filter` (`contact_action_id`),
CONSTRAINT `FK_contact_action_filter` FOREIGN KEY `fkIdx_contact_action_filter` (`contact_action_id`) REFERENCES `contact_actions` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `attempts`

CREATE TABLE `attempts`
(
 `id`                char(36) NOT NULL ,
 `try`               int NOT NULL ,
 `action_channel`    varchar(45) NOT NULL ,
 `message`           varchar(255) NOT NULL ,
 `action_status`     varchar(45) NOT NULL ,
 `twilio_call_sid`   varchar(255) NULL ,
 `sg_message_id`     varchar(255) NULL ,
 `w_message_id`      varchar(255) NULL ,
 `call_duration`     bigint NULL ,
 `g_it_call_id`      varchar(45) NULL ,
 `customer_id`       char(36) NOT NULL ,
 `contact_action_id` char(36) NOT NULL ,
 `createdAt`         datetime NOT NULL ,
 `updatedAt`         datetime NOT NULL ,
 `deletedAt`         datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_contact_action_attempt` (`contact_action_id`),
CONSTRAINT `FK_contact_action_attempt` FOREIGN KEY `fkIdx_contact_action_attempt` (`contact_action_id`) REFERENCES `contact_actions` (`id`),
KEY `fkIdx_customer_attempt` (`customer_id`),
CONSTRAINT `FK_customer_attempt` FOREIGN KEY `fkIdx_customer_attempt` (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `sms_history_logs`

CREATE TABLE `sms_history_logs`
(
 `id`          char(36) NOT NULL ,
 `request`     json NOT NULL ,
 `status_code` int NOT NULL ,
 `response`    json NOT NULL ,
 `url`         varchar(255) NOT NULL ,
 `attempt_id`  char(36) NOT NULL ,
 `createdAt`   datetime NOT NULL ,
 `updatedAt`   datetime NOT NULL ,
 `deletedAt`   datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_sms_history_log_attempt` (`attempt_id`),
CONSTRAINT `FK_sms_history_log_attempt` FOREIGN KEY `fkIdx_sms_history_log_attempt` (`attempt_id`) REFERENCES `attempts` (`id`)
) ENGINE=INNODBDEFAULT CHARSET=utf8mb3;

-- ************************************** `file_vias`

CREATE TABLE `file_vias`
(
 `id`        int NOT NULL AUTO_INCREMENT ,
 `via`       varchar(45) NOT NULL ,
 `createdAt` datetime NOT NULL ,
 `updatedAt` datetime NOT NULL ,
 `deletedAt` datetime NULL ,

PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `file_status`

CREATE TABLE `file_status`
(
 `id`        int NOT NULL AUTO_INCREMENT ,
 `status`    varchar(45) NOT NULL ,
 `createdAt` datetime NOT NULL ,
 `updatedAt` datetime NOT NULL ,
 `deletedAt` datetime NULL ,

PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `assignment_file_history`

CREATE TABLE `assignment_file_history`
(
 `id`             char(36) NOT NULL ,
 `name`           varchar(255) NOT NULL ,
 `size`           varchar(45) NOT NULL ,
 `path`           varchar(255) NOT NULL ,
 `mimetype`       varchar(45) NOT NULL ,
 `file_via_id`    int NOT NULL ,
 `file_status_id` int NOT NULL ,
 `createdAt`      datetime NOT NULL ,
 `updatedAt`      datetime NOT NULL ,
 `deletedAt`      datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_file_via_assignment_file_history` (`file_via_id`),
CONSTRAINT `FK_file_via_assignment_file_history` FOREIGN KEY `fkIdx_file_via_assignment_file_history` (`file_via_id`) REFERENCES `file_vias` (`id`),
KEY `fkIdx_file_status_assignment_file` (`file_status_id`),
CONSTRAINT `FK_file_status_assignment_file` FOREIGN KEY `fkIdx_file_status_assignment_file` (`file_status_id`) REFERENCES `file_status` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `payment_file_history`

CREATE TABLE `payment_file_history`
(
 `id`             char(36) NOT NULL ,
 `name`           varchar(255) NOT NULL ,
 `size`           varchar(45) NOT NULL ,
 `path`           varchar(255) NOT NULL ,
 `mimetype`       varchar(45) NOT NULL ,
 `file_via_id`    int NOT NULL ,
 `file_status_id` int NOT NULL ,
 `createdAt`      datetime NOT NULL ,
 `updatedAt`      datetime NOT NULL ,
 `deletedAt`      datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_file_via_payment_file_history` (`file_via_id`),
CONSTRAINT `FK_file_via_payment_file_history` FOREIGN KEY `fkIdx_file_via_payment_file_history` (`file_via_id`) REFERENCES `file_vias` (`id`),
KEY `fkIdx_file_status_payment_file_history` (`file_status_id`),
CONSTRAINT `FK_file_status_payment_file` FOREIGN KEY `fkIdx_file_status_payment_file_history` (`file_status_id`) REFERENCES `file_status` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `whatsapp_history_logs`

CREATE TABLE `whatsapp_history_logs`
(
 `id`          char(36) NOT NULL ,
 `request`     json NOT NULL ,
 `status_code` int NOT NULL ,
 `response`    json NOT NULL ,
 `url`         varchar(255) NOT NULL ,
 `attempt_id`  char(36) NOT NULL ,
 `createdAt`   datetime NOT NULL ,
 `updatedAt`   datetime NOT NULL ,
 `deletedAt`   datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_whatsapp_history_log_attempt` (`attempt_id`),
CONSTRAINT `FK_whatsapp_history_log_attempt` FOREIGN KEY `fkIdx_whatsapp_history_log_attempt` (`attempt_id`) REFERENCES `attempts` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `historical_payments`

CREATE TABLE `historical_payments`
(
 `id`              char(36) NOT NULL ,
 `payment_date`    varchar(45) NOT NULL ,
 `credit`          bigint NOT NULL ,
 `pay`             double NOT NULL ,
 `current_balance` double NOT NULL ,
 `customer_id`     char(36) NOT NULL ,
 `payment_file_id` char(36) NOT NULL ,
 `createdAt`       datetime NOT NULL ,
 `updatedAt`       datetime NOT NULL ,
 `deletedAt`       datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_customer_payment_history` (`customer_id`),
CONSTRAINT `FK_customer_payment_history` FOREIGN KEY `fkIdx_customer_payment_history` (`customer_id`) REFERENCES `customers` (`id`),
KEY `fkIdx_payment_file_payment_history` (`payment_file_id`),
CONSTRAINT `FK_payment_file_payment_history` FOREIGN KEY `fkIdx_payment_file_payment_history` (`payment_file_id`) REFERENCES `payment_file_history` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `email_history_logs`

CREATE TABLE `email_history_logs`
(
 `id`          char(36) NOT NULL ,
 `request`     json NOT NULL ,
 `status_code` int NOT NULL ,
 `response`    json NOT NULL ,
 `url`         varchar(255) NOT NULL ,
 `attempt_id`  char(36) NOT NULL ,
 `createdAt`   datetime NOT NULL ,
 `updatedAt`   datetime NOT NULL ,
 `deletedAt`   datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_email_history_log_attempt` (`attempt_id`),
CONSTRAINT `FK_email_history_log_attempt` FOREIGN KEY `fkIdx_email_history_log_attempt` (`attempt_id`) REFERENCES `attempts` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `voicebot_history_logs`

CREATE TABLE `voicebot_history_logs`
(
 `id`          char(36) NOT NULL ,
 `request`     json NOT NULL ,
 `status_code` int NOT NULL ,
 `response`    json NOT NULL ,
 `url`         varchar(255) NOT NULL ,
 `attempt_id`  char(36) NOT NULL ,
 `createdAt`   datetime NOT NULL ,
 `updatedAt`   datetime NOT NULL ,
 `deletedAt`   datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_voicebot_history_log_attempt` (`attempt_id`),
CONSTRAINT `FK_voicebot_history_log_attempt` FOREIGN KEY `fkIdx_voicebot_history_log_attempt` (`attempt_id`) REFERENCES `attempts` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `calling_list`

CREATE TABLE `calling_list`
(
 `id`                char(36) NOT NULL ,
 `try`               int NOT NULL ,
 `action_status`     varchar(45) NOT NULL ,
 `customer_id`       char(36) NOT NULL ,
 `contact_action_id` char(36) NOT NULL ,
 `createdAt`         datetime NOT NULL ,
 `updatedAt`         datetime NOT NULL ,
 `deletedAt`         datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_contact_action_calling_list` (`contact_action_id`),
CONSTRAINT `FK_contact_action_calling_list` FOREIGN KEY `fkIdx_contact_action_calling_list` (`contact_action_id`) REFERENCES `contact_actions` (`id`),
KEY `fkIdx_customer_calling_list` (`customer_id`),
CONSTRAINT `FK_customer_calling_list` FOREIGN KEY `fkIdx_customer_calling_list` (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `calling_list_history_logs`

CREATE TABLE `calling_list_history_logs`
(
 `id`              char(36) NOT NULL ,
 `request`         json NOT NULL ,
 `status_code`     int NOT NULL ,
 `response`        json NOT NULL ,
 `url`             varchar(255) NOT NULL ,
 `calling_list_id` char(36) NOT NULL ,
 `createdAt`       datetime NOT NULL ,
 `updatedAt`       datetime NOT NULL ,
 `deletedAt`       datetime NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_call_calling_list_history_log` (`calling_list_id`),
CONSTRAINT `FK_call_calling_list_history_log` FOREIGN KEY `fkIdx_call_calling_list_history_log` (`calling_list_id`) REFERENCES `calling_list` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb3;

-- ************************************** `indexes`

create index attempts_sg_message_id_index
    on attempts (sg_message_id);

create index customers_account_number_index
    on customers (account_number);

create index customers_customer_number_index
    on customers (customer_number);
