# holdsController

API de gestion des voies et des prises.
Documentation dans le fichier Documentation.docx.
Base de donnée dans le dossier db

Exemple d'insertion d'une voie:
db.climbing_paths.insert({"path_id":1, "path_free":true, "path_difficulty":"6A", grips:[{grip_id:1, grip_data:234, grip_on:false}, {grip_id:2, grip_data:234, grip_on:true}]})