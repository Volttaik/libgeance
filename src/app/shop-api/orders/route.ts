import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
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

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        userId,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        city: city || "",
        state: state || "",
        total,
        paystackRef: paystackRef || "",
        status: "paid",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error(orderError);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const orderItems = (items as Array<{ productId: number; productName: string; quantity: number; price: number }>).map(
      (item) => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })
    );

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error(itemsError);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== "etii_admin_session_2025") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
