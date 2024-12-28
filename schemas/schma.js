// create a database table if not exist
const tableQueries = {
  addressQuery:
    "CREATE TABLE IF NOT EXISTS `devices` ( `id` int(11) NOT NULL, `device_id` int(11) NOT NULL, PRIMARY KEY (`device_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
  userQuery:
    "CREATE TABLE IF NOT EXISTS `users` (`id` int(11) NOT NULL AUTO_INCREMENT, `username` varchar(50) NOT NULL, `firstName` varchar(50) NOT NULL, `lastName` varchar(50) NOT NULL, `device_id` int(11) DEFAULT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `admin_user` tinyint(1) DEFAULT 0, PRIMARY KEY (`id`), UNIQUE KEY `username` (`username`), UNIQUE KEY `email` (`email`), KEY `device_id` (`device_id`), CONSTRAINT `users_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`) ON DELETE SET NULL ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",
  temperatureQuery:
    "CREATE TABLE IF NOT EXISTS `temperatures` ( `id` int(11) NOT NULL AUTO_INCREMENT, `device_id` varchar(50) DEFAULT NULL, `temperature` float NOT NULL, `timestamp` datetime DEFAULT current_timestamp(), PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
  temperatureRecorsQuery:
    "CREATE TABLE IF NOT EXISTS `temperature_records` ( `id` int(11) NOT NULL AUTO_INCREMENT, `record_date` date NOT NULL, `temprature` decimal(5,2) DEFAULT NULL, `min_temperature` decimal(5,2) DEFAULT NULL, `max_temperature` decimal(5,2) DEFAULT NULL, `conditions` varchar(200) NOT NULL, `created_at` timestamp NOT NULL DEFAULT current_timestamp(), PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
};

export default tableQueries;
 