-- Verify export completion based on src/schedules/exportScheduleParams.json
--
-- Goal:
-- For each service rule that has a WHERE condition, report rows that are still eligible
-- for export (remaining_rows). If export + soft-delete is working, remaining_rows should be 0.
--
-- Notes:
-- - This script validates DB-side export eligibility only.
-- - It does NOT validate S3 parquet file existence/content.
-- - Services with empty config in exportScheduleParams.json are reported as SKIPPED.

DELIMITER $$

DROP PROCEDURE IF EXISTS verify_export_rule $$
CREATE PROCEDURE verify_export_rule(
  IN p_service_name VARCHAR(128),
  IN p_table_name VARCHAR(128),
  IN p_date_key VARCHAR(128),
  IN p_where_clause TEXT
)
BEGIN
  DECLARE v_table_exists INT DEFAULT 0;
  DECLARE v_sql LONGTEXT;
  DECLARE v_service_escaped VARCHAR(256);
  DECLARE v_table_escaped VARCHAR(256);
  DECLARE v_date_escaped VARCHAR(256);

  SELECT COUNT(1)
    INTO v_table_exists
  FROM information_schema.tables
  WHERE table_schema = DATABASE()
    AND table_name = p_table_name;

  IF v_table_exists = 0 THEN
    SELECT
      p_service_name AS service_name,
      p_table_name AS table_name,
      p_date_key AS date_key,
      'TABLE_NOT_FOUND' AS status,
      NULL AS remaining_rows,
      NULL AS oldest_date_key_value,
      NULL AS newest_date_key_value;
  ELSE
    SET v_service_escaped = REPLACE(p_service_name, '''', '''''');
    SET v_table_escaped = REPLACE(p_table_name, '''', '''''');
    SET v_date_escaped = REPLACE(p_date_key, '''', '''''');

    IF p_date_key IS NULL OR p_date_key = '' THEN
      SET v_sql = CONCAT(
        'SELECT ',
        '''', v_service_escaped, ''' AS service_name, ',
        '''', v_table_escaped, ''' AS table_name, ',
        'NULL AS date_key, ',
        '''OK'' AS status, ',
        'COUNT(1) AS remaining_rows, ',
        'NULL AS oldest_date_key_value, ',
        'NULL AS newest_date_key_value ',
        'FROM `', p_table_name, '` ',
        'WHERE ', p_where_clause
      );
    ELSE
      SET v_sql = CONCAT(
        'SELECT ',
        '''', v_service_escaped, ''' AS service_name, ',
        '''', v_table_escaped, ''' AS table_name, ',
        '''', v_date_escaped, ''' AS date_key, ',
        '''OK'' AS status, ',
        'COUNT(1) AS remaining_rows, ',
        'MIN(`', p_date_key, '`) AS oldest_date_key_value, ',
        'MAX(`', p_date_key, '`) AS newest_date_key_value ',
        'FROM `', p_table_name, '` ',
        'WHERE ', p_where_clause
      );
    END IF;

    SET @verify_sql = v_sql;
    PREPARE stmt FROM @verify_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END $$

DELIMITER ;

-- =========================
-- Rules from exportScheduleParams.json
-- =========================
CALL verify_export_rule('auditLogService', 'audit_log', 'timestamp', 'is_deleted = 0');
CALL verify_export_rule('cycleReportsLogService', 'cycle_reports_log', 'date', 'is_deleted = 0 AND (date IS NULL OR date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('fdbuttonsService', 'fdbuttons', 'createdon', 'is_deleted = 0 AND (createdon IS NULL OR createdon <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('isUpdateAvailableArchiveService', 'is_update_available_archive', 'date_time', 'is_deleted = 0 AND (date_time IS NULL OR date_time <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('isUpdateAvailableDailyLogService', 'is_update_available_daily_log', 'request_date', 'is_deleted = 0 AND (request_date IS NULL OR request_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('isupdatesAvailableLogService', 'isupdates_available_log', 'date', 'is_deleted = 0 AND (date IS NULL OR date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('onlineAccessTokensService', 'online_access_tokens', 'created_at', 'is_deleted = 0 AND (created_at IS NULL OR created_at <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');

CALL verify_export_rule('printoutsEmailAttachmentOldService', 'printouts_email_attachment_old', 'created_at', 'is_deleted = 0 AND (created_at IS NULL OR created_at <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsEmailAttachmentRecoveryService', 'printouts_email_attachment_recovery', 'created_at', 'is_deleted = 0 AND (created_at IS NULL OR created_at <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsEmailAttachmentService', 'printouts_email_attachment', 'created_at', 'is_deleted = 0 AND (created_at IS NULL OR created_at <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsEmailMd5sumLockService', 'printouts_email_md5sum_lock', 'timestamp', 'is_deleted = 0 AND (timestamp IS NULL OR timestamp <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsFaultyDataService', 'printouts_faulty_data', 'date_time', 'is_deleted = 0 AND (date_time IS NULL OR date_time <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsHydrimAdtService', 'printouts_hydrim_adt', 'updated_date', 'is_deleted = 0 AND (updated_date IS NULL OR updated_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsHydrimDocuCiService', 'printouts_hydrim_docu_ci', 'updated_date', 'is_deleted = 0 AND (updated_date IS NULL OR updated_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsHydrimDocuEntriesNoteService', 'printouts_hydrim_docu_entries_note', 'created_date', 'is_deleted = 0 AND (created_date IS NULL OR created_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsHydrimDocuEntriesService', 'printouts_hydrim_docu_entries', 'creation_date_time', 'is_deleted = 0 AND (creation_date_time IS NULL OR creation_date_time <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsHydrimDocuGccService', 'printouts_hydrim_docu_gcc', 'updated_date', 'is_deleted = 0 AND (updated_date IS NULL OR updated_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsHydrimMonthService', 'printouts_hydrim_month', 'date_time', 'is_deleted = 0 AND (date_time IS NULL OR date_time <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsMovedToArchivesService', 'printouts_moved_to_archives', 'date', 'is_deleted = 0 AND (date IS NULL OR date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');

CALL verify_export_rule('printoutsStatimAdtService', 'printouts_statim_adt', 'updated_date', 'is_deleted = 0 AND (updated_date IS NULL OR updated_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsStatimDocuCiService', 'printouts_statim_docu_ci', 'updated_date', 'is_deleted = 0 AND (updated_date IS NULL OR updated_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsStatimDocuEntriesNoteService', 'printouts_statim_docu_entries_note', 'created_date', 'is_deleted = 0 AND (created_date IS NULL OR created_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsStatimDocuEntriesService', 'printouts_statim_docu_entries', 'creation_date_time', 'is_deleted = 0 AND (creation_date_time IS NULL OR creation_date_time <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsStatimDocuGccService', 'printouts_statim_docu_gcc', 'updated_date', 'is_deleted = 0 AND (updated_date IS NULL OR updated_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('printoutsStatimMonthService', 'printouts_statim_month', 'date_time', 'is_deleted = 0 AND (date_time IS NULL OR date_time <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');

CALL verify_export_rule('productsSparePartsImagesService', 'products_spare_parts_images', 'updaloaded', 'is_deleted = 0 AND (updaloaded IS NULL OR updaloaded <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('reportsImagesService', 'reports_images', 'date', 'is_deleted = 0 AND (date IS NULL OR date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('reportsUploadService', 'reports_upload', 'createdon', 'is_deleted = 0 AND (createdon IS NULL OR createdon <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('unitsCfNotificationsService', 'units_cf_notifications', 'date_originated', 'is_deleted = 0 AND (date_originated IS NULL OR date_originated <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('unitsDailyDetailSummaryService', 'units_daily_detail_summary', 'date_of_summary', 'is_deleted = 0 AND (date_of_summary IS NULL OR date_of_summary <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('unitsDailyGeneralCountSummaryService', 'units_daily_general_count_summary', 'date_of_summary', 'is_deleted = 0 AND (date_of_summary IS NULL OR date_of_summary <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('unitsEncryptedKeysArchivesService', 'units_encrypted_keys_archives', 'date', 'is_deleted = 0 AND (date IS NULL OR date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');
CALL verify_export_rule('unitsOffsetsService', 'units_offsets', 'factory_offsets_update_date', 'is_deleted = 0 AND (factory_offsets_update_date IS NULL OR factory_offsets_update_date <= DATE_SUB(NOW(), INTERVAL 5 YEAR))');

-- =========================
-- Services intentionally skipped (empty config in exportScheduleParams.json)
-- =========================
SELECT 'printoutsBravoS3Service' AS service_name, 'SKIPPED_EMPTY_CONFIG' AS status;
SELECT 'printoutsHydrimS3Service' AS service_name, 'SKIPPED_EMPTY_CONFIG' AS status;
SELECT 'printoutsStatimS3Service' AS service_name, 'SKIPPED_EMPTY_CONFIG' AS status;

-- Optional cleanup
DROP PROCEDURE IF EXISTS verify_export_rule;
