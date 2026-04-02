import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { verifyToken, ADMIN_TOKEN } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const {
      customerName, customerEmail, customerPhone,
      deliveryAddress, city, state, items, total, paystackRef,
    } = await req.json();

    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const authToken = req.cookies.get("auth_token")?.value;
    let userId: number | null = null;
    if (authToken) {
      const payload = verifyToken(authToken);
      if (payload) userId = payload.userId;
    }

    const orderResult = await db.execute({
      sql: `INSERT INTO orders (userId, customerName, customerEmail, customerPhone, deliveryAddress, city, state, total, paystackRef, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid') RETURNING id`,
      args: [userId, customerName, customerEmail, customerPhone, deliveryAddress, city || "", state || "", total, paystackRef || ""],
    });
    const orderId = orderResult.rows[0].id as number;

    for (const item of items as Array<{ productId: number; productName: string; quantity: number; price: number }>) {
      await db.execute({
        sql: "INSERT INTO order_items (orderId, productId, productName, quantity, price) VALUES (?, ?, ?, ?, ?)",
        args: [orderId, item.productId, item.productName, item.quantity, item.price],
      });
    }

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ordersResult = await db.execute("SELECT * FROM orders ORDER BY createdAt DESC");
    const orders = await Promise.all(
      ordersResult.rows.map(async (o) => {
        const itemsResult = await db.execute({
          sql: "SELECT productName, quantity, price FROM order_items WHERE orderId=?",
          args: [o.id as number],
        });
        return { ...o, items: itemsResult.rows };
      })
    );
    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
