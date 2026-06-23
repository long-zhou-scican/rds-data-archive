ALTER TABLE `is_update_available_daily_log`
  ADD INDEX `idx_serial_is_deleted` (`serial_num`, `is_deleted`);
