import bcrypt from "bcryptjs";
import { closeDatabase, getCollections } from "../db.js";
import { admins, appointments, chatMessages, customers, notifications, providers, services, unavailability, waitlist } from "../data/seedData.js";

const SALT_ROUNDS = 10;

async function hashUsers(users) {
  return Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, SALT_ROUNDS)
    }))
  );
}

async function run() {
  const collections = await getCollections();

  // Hash passwords for seed users
  const [hashedCustomers, hashedAdmins] = await Promise.all([
    hashUsers(customers),
    hashUsers(admins)
  ]);

  await Promise.all([
    collections.admins.deleteMany({}),
    collections.customers.deleteMany({}),
    collections.providers.deleteMany({}),
    collections.services.deleteMany({}),
    collections.unavailability.deleteMany({}),
    collections.appointments.deleteMany({}),
    collections.waitlist.deleteMany({}),
    collections.notifications.deleteMany({}),
    collections.chatMessages.deleteMany({})
  ]);

  await Promise.all([
    collections.admins.insertMany(hashedAdmins),
    collections.customers.insertMany(hashedCustomers),
    collections.providers.insertMany(providers),
    collections.services.insertMany(services),
    collections.unavailability.insertMany(unavailability),
    collections.appointments.insertMany(appointments),
    collections.waitlist.insertMany(waitlist),
    collections.notifications.insertMany(notifications),
    collections.chatMessages.insertMany(chatMessages)
  ]);

  await collections.customers.createIndex({ email: 1 }, { unique: true });
  await collections.admins.createIndex({ email: 1 }, { unique: true });
  await collections.appointments.createIndex({ providerId: 1, date: 1, startTime: 1 });
  await collections.chatMessages.createIndex({ participantRole: 1, participantId: 1, providerId: 1, createdAt: 1 });

  console.log("MongoDB seed data applied successfully.");
  console.log("");
  console.log("Test credentials (passwords stored as bcrypt hashes):");
  console.log("  Customer → email: customer@example.com  password: customer123");
  console.log("  Admin    → email: admin@example.com     password: admin123");
}

run()
  .catch((error) => {
    console.error("Database initialization failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabase();
  });
