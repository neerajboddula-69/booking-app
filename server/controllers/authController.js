import bcrypt from "bcryptjs";
import { getCollections } from "../db.js";
import { createId } from "../services/bookingService.js";

const SALT_ROUNDS = 10;

export async function login(req, res) {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ message: "Role, email and password are required." });
    }

    const collections = await getCollections();
    const normalizedEmail = String(email).trim().toLowerCase();
    const collection = role === "admin" ? collections.admins : collections.customers;
    const user = await collection.findOne({ email: normalizedEmail }, { projection: { _id: 0 } });

    if (!user) {
      return res.status(401).json({ message: "Invalid login details." });
    }

    const passwordMatch = await bcrypt.compare(String(password), user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid login details." });
    }

    return res.json({
      token: `demo-token-${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title || "Customer"
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Unable to complete login." });
  }
}

export async function registerCustomer(req, res) {
  try {
    const { name, email, password, phone = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const collections = await getCollections();
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingCustomer = await collections.customers.findOne({ email: normalizedEmail }, { projection: { _id: 0 } });
    const existingAdmin = await collections.admins.findOne({ email: normalizedEmail }, { projection: { _id: 0 } });

    if (existingCustomer || existingAdmin) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(String(password), SALT_ROUNDS);

    const customer = {
      id: createId("cust"),
      role: "customer",
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      password: hashedPassword,
      preferredProviders: [],
      preferredWindow: ["09:00", "17:00"]
    };

    await collections.customers.insertOne(customer);

    return res.status(201).json({
      message: "Customer account created successfully.",
      token: `demo-token-${customer.id}`,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: customer.role,
        title: "Customer"
      }
    });
  } catch (error) {
    console.error("Register customer error:", error);
    return res.status(500).json({ message: "Unable to create customer account." });
  }
}

export async function registerAdmin(req, res) {
  try {
    const { name, email, password, phone = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const collections = await getCollections();
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingCustomer = await collections.customers.findOne({ email: normalizedEmail }, { projection: { _id: 0 } });
    const existingAdmin = await collections.admins.findOne({ email: normalizedEmail }, { projection: { _id: 0 } });

    if (existingCustomer || existingAdmin) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(String(password), SALT_ROUNDS);

    const admin = {
      id: createId("admin"),
      role: "admin",
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      password: hashedPassword,
      title: "Booking Administrator"
    };

    await collections.admins.insertOne(admin);

    return res.status(201).json({
      message: "Admin account created successfully.",
      token: `demo-token-${admin.id}`,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        title: admin.title
      }
    });
  } catch (error) {
    console.error("Register admin error:", error);
    return res.status(500).json({ message: "Unable to create admin account." });
  }
}
