
// create a database table if not exist
const tableQueries ={
    addressQuery : 'CREATE TABLE IF NOT EXISTS `devices` ( `id` int(11) NOT NULL, `device_id` int(11) NOT NULL, PRIMARY KEY (`device_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;',
    userQuery : 'CREATE TABLE IF NOT EXISTS`users` ( `id` int(11) NOT NULL AUTO_INCREMENT, `device_id` int(11) DEFAULT NULL, `firstName` varchar(100) NOT NULL, `lastName` varchar(255) NOT NULL, `email` varchar(200) NOT NULL, `password` varchar(255) NOT NULL, `user_created` timestamp NOT NULL DEFAULT current_timestamp(), PRIMARY KEY (`id`), UNIQUE KEY `email` (`email`), KEY `device_id` (`device_id`), CONSTRAINT `users_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`) ON DELETE SET NULL ) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;'
}
module.exports = tableQueries;
