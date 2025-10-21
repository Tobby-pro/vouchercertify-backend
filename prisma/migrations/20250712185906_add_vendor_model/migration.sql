-- Step 1: Create Vendor table
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- Step 2: Create a generic vendor to assign existing vouchers to
INSERT INTO "Vendor" ("id", "name") VALUES (1, 'General') ON CONFLICT DO NOTHING;

-- Step 3: Alter Voucher table — remove old vendor column, add new one as nullable
ALTER TABLE "Voucher"
DROP COLUMN IF EXISTS "vendor",
ADD COLUMN "vendorId" INTEGER;

-- Step 4: Assign all existing vouchers to vendor with id = 1
UPDATE "Voucher" SET "vendorId" = 1 WHERE "vendorId" IS NULL;

-- Step 5: Make vendorId NOT NULL
ALTER TABLE "Voucher" ALTER COLUMN "vendorId" SET NOT NULL;

-- Step 6: Add foreign key constraint
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_vendorId_fkey"
  FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 7: Create unique index
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");
