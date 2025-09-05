import express from "express";
import db from "../config/database.js";

const router = express.Router();

// POST API
router.post("/customers", (req, res) => {
  const { firstName, lastName, email, phone, addresses } = req.body;
  console.log("Received customer data:", req.body);

  const sqlCustomer =
    "INSERT INTO customers (firstName, lastName, email, phone) VALUES (?, ?, ?, ?)";
  db.query(
    sqlCustomer,
    [firstName, lastName, email, phone],
    (err, customerResult) => {
      if (err) {
        console.error("Customer insert error:", err);
        return res.status(500).json({ error: err.message });
      }

      const customerId = customerResult.insertId;
      console.log("Customer inserted with ID:", customerId);

      if (!addresses || addresses.length === 0) {
        return res.status(201).json({
          message: "Customer added successfully (no addresses)",
          customerId,
        });
      }

      const sqlAddress =
        "INSERT INTO addresses (customer_id, streetAddress, city, state, PINCode, country) VALUES ?";
      const addressValues = addresses.map((addr) => [
        customerId,
        addr.streetAddress,
        addr.city,
        addr.state,
        addr.PINCode,
        addr.country,
      ]);

      db.query(sqlAddress, [addressValues], (err, addressResult) => {
        if (err) {
          console.error("Address insert error:", err);
          return res.status(500).json({ error: err.message });
        }

        console.log("Addresses inserted for customer:", customerId);

        res.status(201).json({
          message: "Customer and addresses added successfully",
          customerId,
        });
      });
    }
  );
});

// GET API
router.get("/customers/:id", (req, res) => {
  const { id } = req.params;
  const sqlCustomer = "SELECT * FROM customers WHERE id = ?";
  db.query(sqlCustomer, [id], (err, customerResults) => {
    if (err) {
      console.error("Error fetching customer:", err);
      return res.status(500).json({ error: err.message });
    }
    if (customerResults.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customer = customerResults[0];
    const sqlAddresses = "SELECT * FROM addresses WHERE customer_id = ?";
    db.query(sqlAddresses, [id], (err, addressResults) => {
      if (err) {
        console.error("Error fetching addresses:", err);
        return res.status(500).json({ error: err.message });
      }
      customer.addresses = addressResults;
      res.json(customer);
    });
  });
});

// DELETE API
router.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  console.log("Delete request for customer ID:", id);
  const sql = "DELETE FROM customers WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting customer:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  });
});

// PUT API
router.put("/customers/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, addresses } = req.body;
  console.log("Update request for customer ID:", id, "with data:", req.body);
  const sqlUpdateCustomer =
    "UPDATE customers SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?";
  db.query(
    sqlUpdateCustomer,
    [firstName, lastName, email, phone, id],
    (err, customerResult) => {
      if (err) {
        console.error("Customer update error:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("Customer updated with ID:", id);
      const sqlDeleteAddresses = "DELETE FROM addresses WHERE customer_id = ?";
      db.query(sqlDeleteAddresses, [id], (err, deleteResult) => {
        if (err) {
          console.error("Address delete error:", err);
          return res.status(500).json({ error: err.message });
        }
        if (!addresses || addresses.length === 0) {
          return res.status(200).json({
            message: "Customer updated successfully (no addresses)",
          });
        }
        const sqlInsertAddresses =
          "INSERT INTO addresses (customer_id, streetAddress, city, state, PINCode, country) VALUES ?";
        const addressValues = addresses.map((addr) => [
          id,
          addr.streetAddress,
          addr.city,
          addr.state,
          addr.PINCode,
          addr.country,
        ]);
        db.query(sqlInsertAddresses, [addressValues], (err, addressResult) => {
          if (err) {
            console.error("Address insert error:", err);
            return res.status(500).json({ error: err.message });
          }
          console.log("Addresses updated for customer:", id);
          res.status(200).json({
            message: "Customer and addresses updated successfully",
          });
        });
      });
    }
  );
});

// GET API with Filters
router.get("/customers", (req, res) => {
  const { search = "", city = "", state = "", sortOrder = "asc" } = req.query;
  let sql = `
    SELECT c.id AS customerId, c.firstName, c.lastName, c.email, c.phone,
           a.id AS addressId, a.streetAddress, a.city, a.state, a.PINCode, a.country
    FROM customers c
    LEFT JOIN addresses a ON c.id = a.customer_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += ` AND (
      c.firstName LIKE ? OR
      c.lastName LIKE ? OR
      c.email LIKE ? OR
      c.phone LIKE ?
    )`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  if (city) {
    sql += ` AND a.city LIKE ?`;
    params.push(`%${city}%`);
  }

  if (state) {
    sql += ` AND a.state LIKE ?`;
    params.push(`%${state}%`);
  }

  sql += ` ORDER BY c.firstName ${sortOrder === "desc" ? "DESC" : "ASC"}`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).json({ error: err.message });
    }

    const customers = {};
    results.forEach((row) => {
      if (!customers[row.customerId]) {
        customers[row.customerId] = {
          id: row.customerId,
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          phone: row.phone,
          addresses: [],
        };
      }
      if (row.addressId) {
        customers[row.customerId].addresses.push({
          id: row.addressId,
          streetAddress: row.streetAddress,
          city: row.city,
          state: row.state,
          PINCode: row.PINCode,
          country: row.country,
        });
      }
    });

    let customerArray = Object.values(customers);

    customerArray.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.firstName.localeCompare(a.firstName);
      }
      return a.firstName.localeCompare(b.firstName);
    });

    res.json(customerArray);
  });
});

export default router;
