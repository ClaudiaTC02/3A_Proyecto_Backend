BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Dispositivo" (
	"Id"	INTEGER NOT NULL UNIQUE,
	"Nombre"	TEXT NOT NULL,
	PRIMARY KEY("Id")
);
CREATE TABLE IF NOT EXISTS "Usuario_Dispositivo" (
	"Id_Usuario"	INTEGER NOT NULL,
	"Id_Dispositivo"	INTEGER,
	FOREIGN KEY("Id_Dispositivo") REFERENCES "Dispositivo"("Id"),
	FOREIGN KEY("Id_Usuario") REFERENCES "Usuario"("Id")
);
CREATE TABLE IF NOT EXISTS "Usuario" (
	"Nombre"	TEXT NOT NULL,
	"Id"	INTEGER NOT NULL UNIQUE,
	"Contraseña"	TEXT NOT NULL,
	"Correo"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("Id")
);
CREATE TABLE IF NOT EXISTS "Medida" (
	"Id"	INTEGER NOT NULL UNIQUE,
	"Dato"	INTEGER NOT NULL,
	"Fecha"	INTEGER NOT NULL,
	"Id_Dispositivo"	INTEGER NOT NULL,
	"Latitud"	INTEGER NOT NULL,
	"Longitud"	INTEGER NOT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT),
	FOREIGN KEY("Id_Dispositivo") REFERENCES "Dispositivo"("Id")
);
INSERT INTO "Dispositivo" VALUES (1,'Prueba');
INSERT INTO "Usuario_Dispositivo" VALUES (1,1);
INSERT INTO "Usuario" VALUES ('Prueba',1,'Prueba','Prueba@gmail.com');
INSERT INTO "Usuario" VALUES ('Prueba2',2,'Prueba2','Prueba2@gmail.com');
COMMIT;
