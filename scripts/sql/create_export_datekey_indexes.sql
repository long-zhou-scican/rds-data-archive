-- Create dateKey-focused indexes for export schedule tables.
-- Generated from src/schedules/exportScheduleParams.json.
--
-- This script creates:
--   1) idx_<table>_<dateKey> on (<dateKey>)
--   2) idx_<table>_is_deleted_<dateKey> on (is_deleted, <dateKey>)
--
-- Why both:
-- - dateKey-only helps date-based scans/order/grouping
-- - (is_deleted, dateKey) helps the common filter pattern:
--     is_deleted = 0 AND (<dateKey> is null or <dateKey> <= ...)
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

-- auditLogService
CALL add_index_if_missing('audit_log', 'idx_audit_log_timestamp', '`timestamp`');
CALL add_index_if_missing('audit_log', 'idx_audit_log_is_deleted_timestamp', '`is_deleted`, `timestamp`');

-- cycleReportsLogService
CALL add_index_if_missing('cycle_reports_log', 'idx_cycle_reports_log_date', '`date`');
CALL add_index_if_missing('cycle_reports_log', 'idx_cycle_reports_log_is_deleted_date', '`is_deleted`, `date`');

-- fdbuttonsService
CALL add_index_if_missing('fdbuttons', 'idx_fdbuttons_createdon', '`createdon`');
CALL add_index_if_missing('fdbuttons', 'idx_fdbuttons_is_deleted_createdon', '`is_deleted`, `createdon`');

-- isUpdateAvailableArchiveService
CALL add_index_if_missing('is_update_available_archive', 'idx_is_update_available_archive_date_time', '`date_time`');
CALL add_index_if_missing('is_update_available_archive', 'idx_is_update_available_archive_is_deleted_date_time', '`is_deleted`, `date_time`');

-- isUpdateAvailableDailyLogService
CALL add_index_if_missing('is_update_available_daily_log', 'idx_is_update_available_daily_log_request_date', '`request_date`');
CALL add_index_if_missing('is_update_available_daily_log', 'idx_is_update_available_daily_log_is_deleted_request_date', '`is_deleted`, `request_date`');

-- isupdatesAvailableLogService
CALL add_index_if_missing('isupdates_available_log', 'idx_isupdates_available_log_date', '`date`');
CALL add_index_if_missing('isupdates_available_log', 'idx_isupdates_available_log_is_deleted_date', '`is_deleted`, `date`');

-- onlineAccessTokensService
CALL add_index_if_missing('online_access_tokens', 'idx_online_access_tokens_created_at', '`created_at`');
CALL add_index_if_missing('online_access_tokens', 'idx_online_access_tokens_is_deleted_created_at', '`is_deleted`, `created_at`');

-- printoutsEmailAttachmentOldService
CALL add_index_if_missing('printouts_email_attachment_old', 'idx_printouts_email_attachment_old_created_at', '`created_at`');
CALL add_index_if_missing('printouts_email_attachment_old', 'idx_printouts_email_attachment_old_is_deleted_created_at', '`is_deleted`, `created_at`');

-- printoutsEmailAttachmentRecoveryService
CALL add_index_if_missing('printouts_email_attachment_recovery', 'idx_printouts_email_attachment_recovery_created_at', '`created_at`');
CALL add_index_if_missing('printouts_email_attachment_recovery', 'idx_printouts_email_attachment_recovery_is_deleted_created_at', '`is_deleted`, `created_at`');

-- printoutsEmailAttachmentService
CALL add_index_if_missing('printouts_email_attachment', 'idx_printouts_email_attachment_created_at', '`created_at`');
CALL add_index_if_missing('printouts_email_attachment', 'idx_printouts_email_attachment_is_deleted_created_at', '`is_deleted`, `created_at`');

-- printoutsEmailMd5sumLockService
CALL add_index_if_missing('printouts_email_md5sum_lock', 'idx_printouts_email_md5sum_lock_timestamp', '`timestamp`');
CALL add_index_if_missing('printouts_email_md5sum_lock', 'idx_printouts_email_md5sum_lock_is_deleted_timestamp', '`is_deleted`, `timestamp`');

-- printoutsFaultyDataService
CALL add_index_if_missing('printouts_faulty_data', 'idx_printouts_faulty_data_date_time', '`date_time`');
CALL add_index_if_missing('printouts_faulty_data', 'idx_printouts_faulty_data_is_deleted_date_time', '`is_deleted`, `date_time`');

-- printoutsHydrimAdtService
CALL add_index_if_missing('printouts_hydrim_adt', 'idx_printouts_hydrim_adt_updated_date', '`updated_date`');
CALL add_index_if_missing('printouts_hydrim_adt', 'idx_printouts_hydrim_adt_is_deleted_updated_date', '`is_deleted`, `updated_date`');

-- printoutsHydrimDocuCiService
CALL add_index_if_missing('printouts_hydrim_docu_ci', 'idx_printouts_hydrim_docu_ci_updated_date', '`updated_date`');
CALL add_index_if_missing('printouts_hydrim_docu_ci', 'idx_printouts_hydrim_docu_ci_is_deleted_updated_date', '`is_deleted`, `updated_date`');

-- printoutsHydrimDocuEntriesNoteService
CALL add_index_if_missing('printouts_hydrim_docu_entries_note', 'idx_printouts_hydrim_docu_entries_note_created_date', '`created_date`');
CALL add_index_if_missing('printouts_hydrim_docu_entries_note', 'idx_printouts_hydrim_docu_entries_note_is_deleted_created_date', '`is_deleted`, `created_date`');

-- printoutsHydrimDocuEntriesService
CALL add_index_if_missing('printouts_hydrim_docu_entries', 'idx_printouts_hydrim_docu_entries_creation_date_time', '`creation_date_time`');
CALL add_index_if_missing('printouts_hydrim_docu_entries', 'idx_printouts_hydrim_docu_entries_is_deleted_creation_date_time', '`is_deleted`, `creation_date_time`');

-- printoutsHydrimDocuGccService
CALL add_index_if_missing('printouts_hydrim_docu_gcc', 'idx_printouts_hydrim_docu_gcc_updated_date', '`updated_date`');
CALL add_index_if_missing('printouts_hydrim_docu_gcc', 'idx_printouts_hydrim_docu_gcc_is_deleted_updated_date', '`is_deleted`, `updated_date`');

-- printoutsHydrimMonthService
CALL add_index_if_missing('printouts_hydrim_month', 'idx_printouts_hydrim_month_date_time', '`date_time`');
CALL add_index_if_missing('printouts_hydrim_month', 'idx_printouts_hydrim_month_is_deleted_date_time', '`is_deleted`, `date_time`');

-- printoutsMovedToArchivesService
CALL add_index_if_missing('printouts_moved_to_archives', 'idx_printouts_moved_to_archives_date', '`date`');
CALL add_index_if_missing('printouts_moved_to_archives', 'idx_printouts_moved_to_archives_is_deleted_date', '`is_deleted`, `date`');

-- printoutsStatimAdtService
CALL add_index_if_missing('printouts_statim_adt', 'idx_printouts_statim_adt_updated_date', '`updated_date`');
CALL add_index_if_missing('printouts_statim_adt', 'idx_printouts_statim_adt_is_deleted_updated_date', '`is_deleted`, `updated_date`');

-- printoutsStatimDocuCiService
CALL add_index_if_missing('printouts_statim_docu_ci', 'idx_printouts_statim_docu_ci_updated_date', '`updated_date`');
CALL add_index_if_missing('printouts_statim_docu_ci', 'idx_printouts_statim_docu_ci_is_deleted_updated_date', '`is_deleted`, `updated_date`');

-- printoutsStatimDocuEntriesNoteService
CALL add_index_if_missing('printouts_statim_docu_entries_note', 'idx_printouts_statim_docu_entries_note_created_date', '`created_date`');
CALL add_index_if_missing('printouts_statim_docu_entries_note', 'idx_printouts_statim_docu_entries_note_is_deleted_created_date', '`is_deleted`, `created_date`');

-- printoutsStatimDocuEntriesService
CALL add_index_if_missing('printouts_statim_docu_entries', 'idx_printouts_statim_docu_entries_creation_date_time', '`creation_date_time`');
CALL add_index_if_missing('printouts_statim_docu_entries', 'idx_printouts_statim_docu_entries_is_deleted_creation_date_time', '`is_deleted`, `creation_date_time`');

-- printoutsStatimDocuGccService
CALL add_index_if_missing('printouts_statim_docu_gcc', 'idx_printouts_statim_docu_gcc_updated_date', '`updated_date`');
CALL add_index_if_missing('printouts_statim_docu_gcc', 'idx_printouts_statim_docu_gcc_is_deleted_updated_date', '`is_deleted`, `updated_date`');

-- printoutsStatimMonthService
CALL add_index_if_missing('printouts_statim_month', 'idx_printouts_statim_month_date_time', '`date_time`');
CALL add_index_if_missing('printouts_statim_month', 'idx_printouts_statim_month_is_deleted_date_time', '`is_deleted`, `date_time`');

-- productsSparePartsImagesService
CALL add_index_if_missing('products_spare_parts_images', 'idx_products_spare_parts_images_updaloaded', '`updaloaded`');
CALL add_index_if_missing('products_spare_parts_images', 'idx_products_spare_parts_images_is_deleted_updaloaded', '`is_deleted`, `updaloaded`');

-- reportsImagesService
CALL add_index_if_missing('reports_images', 'idx_reports_images_date', '`date`');
CALL add_index_if_missing('reports_images', 'idx_reports_images_is_deleted_date', '`is_deleted`, `date`');

-- reportsUploadService
CALL add_index_if_missing('reports_upload', 'idx_reports_upload_createdon', '`createdon`');
CALL add_index_if_missing('reports_upload', 'idx_reports_upload_is_deleted_createdon', '`is_deleted`, `createdon`');

-- unitsCfNotificationsService
CALL add_index_if_missing('units_cf_notifications', 'idx_units_cf_notifications_date_originated', '`date_originated`');
CALL add_index_if_missing('units_cf_notifications', 'idx_units_cf_notifications_is_deleted_date_originated', '`is_deleted`, `date_originated`');

-- unitsDailyDetailSummaryService
CALL add_index_if_missing('units_daily_detail_summary', 'idx_units_daily_detail_summary_date_of_summary', '`date_of_summary`');
CALL add_index_if_missing('units_daily_detail_summary', 'idx_units_daily_detail_summary_is_deleted_date_of_summary', '`is_deleted`, `date_of_summary`');

-- unitsDailyGeneralCountSummaryService
CALL add_index_if_missing('units_daily_general_count_summary', 'idx_units_daily_general_count_summary_date_of_summary', '`date_of_summary`');
CALL add_index_if_missing('units_daily_general_count_summary', 'idx_units_daily_general_count_summary_is_deleted_date_of_summary', '`is_deleted`, `date_of_summary`');

-- unitsEncryptedKeysArchivesService
CALL add_index_if_missing('units_encrypted_keys_archives', 'idx_units_encrypted_keys_archives_date', '`date`');
CALL add_index_if_missing('units_encrypted_keys_archives', 'idx_units_encrypted_keys_archives_is_deleted_date', '`is_deleted`, `date`');

-- unitsOffsetsService
CALL add_index_if_missing('units_offsets', 'idx_units_offsets_factory_offsets_update_date', '`factory_offsets_update_date`');
CALL add_index_if_missing('units_offsets', 'idx_units_offsets_is_deleted_factory_offsets_update_date', '`is_deleted`, `factory_offsets_update_date`');

-- Optional cleanup
DROP PROCEDURE IF EXISTS add_index_if_missing;
