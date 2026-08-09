-- Requête simple pour voir les tables existantes
SELECT name, type 
FROM sqlite_master 
WHERE type='table';
