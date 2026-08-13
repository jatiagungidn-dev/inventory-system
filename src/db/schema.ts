import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  check,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const inventoryStatusEnum = pgEnum("inventory_status", [
  "AVAILABLE",
  "RESTRICTED",
  "QUARANTINED",
  "SCRAPPED",
]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "INBOUND",
  "RESERVATION",
  "FULFILLMENT",
  "ADJUSTMENT",
  "RELOCATION",
]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  sku: varchar("sku", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  zone: varchar("zone", { length: 10 }).notNull(),
  aisle: varchar("aisle", { length: 10 }).notNull(),
  bay: varchar("bay", { length: 10 }).notNull(),
  bin: varchar("bin", { length: 10 }).notNull(),
  locationCode: varchar("location_code", { length: 50 }).unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    locationId: uuid("location_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    quntityAvailable: integer("quantity_available").default(0).notNull(),
    quntityReserved: integer("quantity_reserved").default(0).notNull(),
    status: inventoryStatusEnum("status").default("AVAILABLE").notNull(),
    version: integer("version").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    checkQtyAvailable: check(
      "chk_qty_available_non_negative",
      sql`${table.quntityAvailable} >= 0`,
    ),
    checkQtyReserved: check(
      "chk_qty_reserved_non_negative",
      sql`${table.quntityReserved} >= 0`,
    ),
    unqProductLocation: uniqueIndex("uq_product_location").on(
      table.productId,
      table.locationId,
    ),
  }),
);

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  inventoryItemId: uuid("inventory_item_id")
    .references(() => inventoryItems.id, { onDelete: "restrict" })
    .notNull(),
  changeAmount: integer("change_amount").notNull(),
  type: transactionTypeEnum("type").notNull(),
  referenceId: varchar("reference_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
