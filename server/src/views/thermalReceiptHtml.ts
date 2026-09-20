export interface ThermalOrderData {
  orderNumber: string;
  createdAt: Date | string;
  orderType: string;
  status: string;
  paymentMethod: string;
  paymentStatus?: string;
  deliveryFee?: number;
  totalAmount: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      area?: string;
      landmark?: string;
    };
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  }>;
}

export function renderServerThermalReceipt(
  order: ThermalOrderData,
  format: '2inch' | 'mini' = '2inch',
  autoprint = false
): string {
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fullAddress = order.customer.address
    ? [
        order.customer.address.street,
        order.customer.address.area,
        order.customer.address.city,
        order.customer.address.landmark ? `(Near: ${order.customer.address.landmark})` : '',
      ]
        .filter(Boolean)
        .join(', ')
    : 'Beachside Counter / Pickup';

  const subtotal = Math.max(0, order.totalAmount - (order.deliveryFee || 0));

  const isMini = format === 'mini';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Receipt #${order.orderNumber} - Brother's Bites</title>
  <style>
    @page {
      size: ${isMini ? '1.75in 2in' : '58mm auto'};
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background: #ffffff;
      color: #000000;
      font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
      font-size: ${isMini ? '7.5pt' : '8.5pt'};
      line-height: ${isMini ? '1.15' : '1.25'};
      width: ${isMini ? '1.75in' : '2in'};
      max-width: ${isMini ? '1.75in' : '2in'};
      margin: 0 auto;
      padding: 4px 6px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .font-bold { font-weight: bold; }
    .uppercase { text-transform: uppercase; }
    .border-b-dashed { border-bottom: 1px dashed #000; }
    .border-t-dashed { border-top: 1px dashed #000; }
    .border-b-solid { border-bottom: 1px solid #000; }
    .border-t-solid { border-top: 1px solid #000; }
    .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .py-1 { padding-top: 3px; padding-bottom: 3px; }
    .my-1 { margin-top: 3px; margin-bottom: 3px; }

    /* Action bar on screen, hidden on print */
    .screen-toolbar {
      position: fixed;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 6px;
      background: #1e293b;
      padding: 6px 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
    }
    .screen-toolbar button, .screen-toolbar a {
      background: #f7b928;
      color: #09090b;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      text-decoration: none;
      font-family: sans-serif;
    }
    .screen-toolbar a.secondary {
      background: #334155;
      color: #fff;
    }
    @media print {
      .screen-toolbar { display: none !important; }
      body { width: 100% !important; max-width: 100% !important; margin: 0 !important; }
    }
  </style>
</head>
<body>
  <!-- Print Controls for Screen Viewing -->
  <div class="screen-toolbar">
    <button onclick="window.print()">🖨️ Print Receipt</button>
    <a href="?format=${isMini ? '2inch' : 'mini'}" class="secondary">
      Switch to ${isMini ? '2" POS (58mm)' : '1.75" Label'}
    </a>
  </div>

  ${
    !isMini
      ? `
  <!-- 2" POS Thermal Receipt (58mm) -->
  <div class="text-center py-1 border-b-dashed">
    <p class="font-bold uppercase" style="font-size: 10pt;">*** BROTHER'S BITES ***</p>
    <p style="font-size: 7.5pt;">Marine Drive, Sonar Para Beach</p>
    <p style="font-size: 7.5pt;">Cox's Bazar · 01627-817436</p>
    <p class="font-bold" style="font-size: 8pt; margin-top: 2px;">** CASHIER TAX INVOICE **</p>
  </div>

  <div class="py-1 border-b-dashed" style="font-size: 7.5pt;">
    <div class="flex-between">
      <span>ORDER: <strong class="font-bold">#${order.orderNumber}</strong></span>
      <span class="font-bold uppercase">[${order.orderType}]</span>
    </div>
    <div class="flex-between" style="font-size: 7pt; color: #333;">
      <span>DATE: ${dateStr}</span>
      <span>STATUS: ${order.status.toUpperCase()}</span>
    </div>
    <div class="flex-between" style="margin-top: 2px;">
      <span>CUSTOMER:</span>
      <span class="font-bold truncate" style="max-width: 110px;">${order.customer.name}</span>
    </div>
    <div class="flex-between">
      <span>PHONE:</span>
      <span>${order.customer.phone}</span>
    </div>
    ${
      order.customer.address?.street
        ? `<p style="font-size: 6.5pt; color: #444; word-break: break-all;">ADDR: ${fullAddress}</p>`
        : ''
    }
  </div>

  <!-- Items Table -->
  <div class="py-1 border-b-dashed">
    <div class="flex-between font-bold border-b-solid" style="padding-bottom: 2px; font-size: 7.5pt;">
      <span style="width: 50%;">ITEM</span>
      <span style="width: 15%; text-align: center;">QTY</span>
      <span style="width: 35%; text-align: right;">TOTAL</span>
    </div>
    <div style="padding-top: 2px;">
      ${order.items
        .map(
          (item) => `
      <div style="margin-bottom: 2px;">
        <div class="flex-between">
          <span style="width: 50%; font-weight: 600;" class="truncate">${item.name}</span>
          <span style="width: 15%; text-align: center;">x${item.quantity}</span>
          <span style="width: 35%; text-align: right; font-weight: bold;">৳${item.price * item.quantity}</span>
        </div>
        ${
          item.specialInstructions
            ? `<p style="font-size: 6.5pt; color: #444; font-style: italic; padding-left: 4px;">&gt; ${item.specialInstructions}</p>`
            : ''
        }
      </div>`
        )
        .join('')}
    </div>
  </div>

  <!-- Totals -->
  <div class="py-1" style="font-size: 7.5pt;">
    <div class="flex-between">
      <span>SUBTOTAL:</span>
      <span>৳${subtotal}</span>
    </div>
    <div class="flex-between">
      <span>DELIVERY FEE:</span>
      <span>${order.deliveryFee && order.deliveryFee > 0 ? `৳${order.deliveryFee}` : '৳0 (FREE)'}</span>
    </div>
    <div class="flex-between font-bold border-t-solid" style="margin-top: 2px; padding-top: 2px; font-size: 9.5pt;">
      <span>GRAND TOTAL:</span>
      <span>৳${order.totalAmount}</span>
    </div>
    <div class="flex-between font-bold" style="margin-top: 2px; font-size: 7.5pt;">
      <span>PAYMENT:</span>
      <span class="uppercase">${order.paymentMethod} ${order.paymentStatus ? `(${order.paymentStatus})` : ''}</span>
    </div>
  </div>

  <!-- Barcode & Footer -->
  <div class="text-center border-t-dashed" style="padding-top: 4px; margin-top: 4px;">
    <div style="font-size: 7.5pt; letter-spacing: 2px; background: #f3f4f6; padding: 2px 0; border: 1px solid #e5e7eb;">
      * ${order.orderNumber} *
    </div>
    <p class="font-bold" style="font-size: 7.5pt; margin-top: 3px;">*** THANK YOU! VISIT AGAIN ***</p>
    <p style="font-size: 6.5pt; color: #555;">Taste the Brotherhood by the Beach</p>
  </div>
  `
      : `
  <!-- 1.75" x 2" Mini Label (Sticker) -->
  <div class="text-center border-b-solid" style="padding-bottom: 2px;">
    <p class="font-bold uppercase" style="font-size: 8.5pt;">BROTHER'S BITES</p>
    <div class="flex-between font-bold" style="font-size: 7pt;">
      <span>#${order.orderNumber}</span>
      <span class="uppercase">[${order.orderType}]</span>
    </div>
  </div>

  <div class="py-1 border-b-dashed" style="font-size: 6.5pt;">
    <div class="flex-between">
      <span class="font-bold truncate" style="max-width: 90px;">${order.customer.name}</span>
      <span>${order.customer.phone}</span>
    </div>
  </div>

  <div class="py-1 border-b-solid" style="font-size: 7pt; font-weight: 600;">
    ${order.items
      .map(
        (item) => `
    <div class="flex-between">
      <span class="truncate" style="max-width: 100px;">${item.name}</span>
      <span>x${item.quantity}</span>
    </div>`
      )
      .join('')}
  </div>

  <div class="flex-between font-bold" style="padding-top: 2px; font-size: 8pt;">
    <span>TOTAL:</span>
    <span>৳${order.totalAmount} (${order.paymentMethod.toUpperCase()})</span>
  </div>

  <p class="text-center border-t-dashed" style="font-size: 6pt; color: #555; margin-top: 2px; padding-top: 2px;">
    Sonar Para Beach • Marine Drive
  </p>
  `
  }

  ${
    autoprint
      ? `<script>
    window.addEventListener('load', () => {
      setTimeout(() => window.print(), 300);
    });
  </script>`
      : ''
  }
</body>
</html>`;
}
