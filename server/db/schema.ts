import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('United States'),
  dateOfBirth: varchar('date_of_birth', { length: 20 }),
  emailVerified: boolean('email_verified').default(false),
  verificationToken: text('verification_token'),
  verificationExpires: timestamp('verification_expires'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const bankAccounts = pgTable('bank_accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  accountNumber: varchar('account_number', { length: 20 }).notNull().unique(),
  accountType: varchar('account_type', { length: 50 }).notNull(),
  balance: decimal('balance', { precision: 15, scale: 2 }).default('0.00'),
  currency: varchar('currency', { length: 10 }).default('USD'),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow()
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').references(() => bankAccounts.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }),
  recipientName: varchar('recipient_name', { length: 255 }),
  recipientAccount: varchar('recipient_account', { length: 50 }),
  status: varchar('status', { length: 20 }).default('completed'),
  createdAt: timestamp('created_at').defaultNow()
});

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  minAmount: decimal('min_amount', { precision: 15, scale: 2 }).notNull(),
  maxAmount: decimal('max_amount', { precision: 15, scale: 2 }).notNull(),
  apr: decimal('apr', { precision: 5, scale: 2 }).notNull(),
  termMonths: integer('term_months').notNull(),
  features: jsonb('features'),
  requirements: text('requirements'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow()
});

export const loanApplications = pgTable('loan_applications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  loanId: integer('loan_id').references(() => loans.id).notNull(),
  requestedAmount: decimal('requested_amount', { precision: 15, scale: 2 }).notNull(),
  termMonths: integer('term_months').notNull(),
  employmentStatus: varchar('employment_status', { length: 50 }),
  annualIncome: decimal('annual_income', { precision: 15, scale: 2 }),
  purpose: text('purpose'),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow()
});

export const housingOffers = pgTable('housing_offers', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  location: varchar('location', { length: 255 }).notNull(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  sqft: integer('sqft'),
  description: text('description'),
  features: jsonb('features'),
  imageUrl: text('image_url'),
  propertyType: varchar('property_type', { length: 50 }),
  mortgageRate: decimal('mortgage_rate', { precision: 5, scale: 3 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const mortgageApplications = pgTable('mortgage_applications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  housingOfferId: integer('housing_offer_id').references(() => housingOffers.id).notNull(),
  downPayment: decimal('down_payment', { precision: 15, scale: 2 }).notNull(),
  loanAmount: decimal('loan_amount', { precision: 15, scale: 2 }).notNull(),
  termYears: integer('term_years').notNull(),
  employmentStatus: varchar('employment_status', { length: 50 }),
  annualIncome: decimal('annual_income', { precision: 15, scale: 2 }),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
  bankAccounts: many(bankAccounts),
  loanApplications: many(loanApplications),
  mortgageApplications: many(mortgageApplications)
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({
  user: one(users, { fields: [bankAccounts.userId], references: [users.id] }),
  transactions: many(transactions)
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(bankAccounts, { fields: [transactions.accountId], references: [bankAccounts.id] })
}));

export const loanApplicationsRelations = relations(loanApplications, ({ one }) => ({
  user: one(users, { fields: [loanApplications.userId], references: [users.id] }),
  loan: one(loans, { fields: [loanApplications.loanId], references: [loans.id] })
}));

export const mortgageApplicationsRelations = relations(mortgageApplications, ({ one }) => ({
  user: one(users, { fields: [mortgageApplications.userId], references: [users.id] }),
  housingOffer: one(housingOffers, { fields: [mortgageApplications.housingOfferId], references: [housingOffers.id] })
}));
