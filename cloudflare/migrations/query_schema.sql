-- ============================================================
-- Vue d'ensemble du schéma de la base de données
-- ============================================================

-- 1. Toutes les tables
SELECT 
    name as 'Table',
    type,
    sql as 'Definition'
FROM sqlite_master
WHERE type='table'
ORDER BY name;

-- 2. Colonnes avec types et clés (version simplifiée)
SELECT
    m.name as Table_Name,
    p.name as Column_Name,
    p.type as Type,
    p.pk as Is_Primary_Key
FROM sqlite_master m
LEFT JOIN pragma_table_info(m.name) p ON 1=1
WHERE m.type='table'
ORDER BY m.name, p.cid;

-- 3. Relations (Foreign Keys) - version simplifiée
SELECT
    m.name as Table_Name,
    fk.from_column as Column_Name,
    fk.table as Reference_Table,
    fk.to_column as Reference_Column
FROM sqlite_master m
JOIN pragma_foreign_key_list(m.name) fk ON 1=1
WHERE m.type='table'
ORDER BY m.name, fk.id;
