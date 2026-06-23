-- Create serial-number-focused indexes for serial partition exports.
--
-- This script creates:
--   1) idx_<table>_serial_num on (serial_num)
--   2) idx_<table>_is_deleted_serial_num on (is_deleted, serial_num)
--
-- Why both:
-- - serial_num helps equality filtering/order by serial
-- - (is_deleted, serial_num) helps the common export predicate pattern:
--     is_deleted = 0 AND serial_num = ?
--
-- Run in the target database for your stage (dev/qa/prod/dr).

DELIMITER $$

DROP PROCEDURE IF EXISTS add_index_if_missing $$
CREATE PROCEDURE add_index_if_missing(
  IN p_table_name VARCHAR(128),
  IN p_index_name VARCHAR(128),
  IN p_index_expr VARCHAR(512)
)
BEGIN
  DECLARE v_exists INT DEFAULT 0;
  DECLARE v_sql TEXT;

  SELECT COUNT(1)
    INTO v_exists
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = p_table_name
    AND index_name = p_index_name;

  IF v_exists = 0 THEN
    SET v_sql = CONCAT(
      'ALTER TABLE `', p_table_name,
      '` ADD INDEX `', p_index_name,
      '` (', p_index_expr, ')'
    );

    SELECT CONCAT('Creating index: ', p_index_name, ' on ', p_table_name) AS info;
    SET @ddl = v_sql;
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  ELSE
    SELECT CONCAT('Index already exists: ', p_index_name, ' on ', p_table_name) AS info;
  END IF;
END $$

DELIMITER ;

-- unitsCfNotificationsService (current serial export bottleneck)
CALL add_index_if_missing('units_cf_notifications', 'idx_units_cf_notifications_serial_num', '`serial_num`');
CALL add_index_if_missing('units_cf_notifications', 'idx_units_cf_notifications_is_deleted_serial_num', '`is_deleted`, `serial_num`');

-- printouts serial exports
CALL add_index_if_missing('printouts_moved_to_archives', 'idx_printouts_moved_to_archives_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_moved_to_archives', 'idx_printouts_moved_to_archives_is_deleted_serial_num', '`is_deleted`, `serial_num`');
CALL add_index_if_missing('printouts_moved_to_archives', 'idx_printouts_moved_to_archives_is_deleted_date_serial', '`is_deleted`, `date`, `serial_num`');

CALL add_index_if_missing('printouts_bravo_s3', 'idx_printouts_bravo_s3_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_bravo_s3', 'idx_printouts_bravo_s3_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_hydrim_s3', 'idx_printouts_hydrim_s3_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_hydrim_s3', 'idx_printouts_hydrim_s3_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_statim_s3', 'idx_printouts_statim_s3_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_statim_s3', 'idx_printouts_statim_s3_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_biosonic_s3', 'idx_printouts_biosonic_s3_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_biosonic_s3', 'idx_printouts_biosonic_s3_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_statim_adt', 'idx_printouts_statim_adt_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_statim_adt', 'idx_printouts_statim_adt_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_hydrim_adt', 'idx_printouts_hydrim_adt_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_hydrim_adt', 'idx_printouts_hydrim_adt_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_hydrim_docu_entries', 'idx_printouts_hydrim_docu_entries_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_hydrim_docu_entries', 'idx_printouts_hydrim_docu_entries_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_hydrim_docu_entries_note', 'idx_printouts_hydrim_docu_entries_note_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_hydrim_docu_entries_note', 'idx_printouts_hydrim_docu_entries_note_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_hydrim_docu_ci', 'idx_printouts_hydrim_docu_ci_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_hydrim_docu_ci', 'idx_printouts_hydrim_docu_ci_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_hydrim_docu_gcc', 'idx_printouts_hydrim_docu_gcc_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_hydrim_docu_gcc', 'idx_printouts_hydrim_docu_gcc_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_hydrim_month', 'idx_printouts_hydrim_month_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_hydrim_month', 'idx_printouts_hydrim_month_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_faulty_data', 'idx_printouts_faulty_data_serial_num', '`serial_num`');
CALL add_index_if_missing('printouts_faulty_data', 'idx_printouts_faulty_data_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('printouts_email_attachment_old', 'idx_printouts_email_attachment_old_serial_number', '`serial_number`');
CALL add_index_if_missing('printouts_email_attachment_old', 'idx_printouts_email_attachment_old_is_deleted_serial_number', '`is_deleted`, `serial_number`');

-- is_update_available serial exports
CALL add_index_if_missing('is_update_available_daily_log', 'idx_is_update_available_daily_log_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('isupdates_available_log', 'idx_isupdates_available_log_serial_num', '`serial_num`');
CALL add_index_if_missing('isupdates_available_log', 'idx_isupdates_available_log_is_deleted_serial_num', '`is_deleted`, `serial_num`');

CALL add_index_if_missing('is_update_available_archive', 'idx_is_update_available_archive_serial_num', '`serial_num`');
CALL add_index_if_missing('is_update_available_archive', 'idx_is_update_available_archive_is_deleted_serial_num', '`is_deleted`, `serial_num`');

-- online_access_tokens serial export (uses serial_number column)
CALL add_index_if_missing('online_access_tokens', 'idx_online_access_tokens_serial_number', '`serial_number`');
CALL add_index_if_missing('online_access_tokens', 'idx_online_access_tokens_is_deleted_serial_number', '`is_deleted`, `serial_number`');

-- Optional cleanup
DROP PROCEDURE IF EXISTS add_index_if_missing;
