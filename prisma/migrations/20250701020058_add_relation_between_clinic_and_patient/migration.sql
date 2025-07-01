/*
Warnings:

- Added the required column `clinicId` to the `patient` table without a default value. This is not possible if the table is not empty.

*/
-- 1. Adiciona a coluna como nullable
ALTER TABLE "patient" ADD COLUMN "clinicId" TEXT;

-- 2. Atualiza os pacientes existentes para um clinicId válido
UPDATE "patient"
SET
    "clinicId" = (
        SELECT "id"
        FROM "clinic"
        LIMIT 1
    );

-- 3. Torna a coluna obrigatória
ALTER TABLE "patient" ALTER COLUMN "clinicId" SET NOT NULL;

-- 4. Adiciona a foreign key
ALTER TABLE "patient"
ADD CONSTRAINT "patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
