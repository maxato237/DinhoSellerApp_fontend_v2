

export const InvoicesData: any[] = Array.from({ length: 2000 }, (_, i) => ({
  num: i + 1,
  type: ["tva", "notva"][Math.floor(Math.random() * 2)],
  status: ["paid", "partly", "unpaid"][Math.floor(Math.random() * 3)],
  TVA: Math.floor(Math.random() * 20) + 1,
  HT: Math.floor(Math.random() * (90000 - 30000) + 30000),
  TTC: 0,
  ECOMP: 0,
  avance: new Date(),
  echeance: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 30))),
  client: [
    {
      code: 1000 + i,
      name: `Client ${i + 1}`,
      type: ["Regular", "VIP", "Corporate"][Math.floor(Math.random() * 3)],
      group: Math.ceil(Math.random() * 10),
      principle_address: `Street ${Math.ceil(Math.random() * 100)}, City ${Math.ceil(Math.random() * 50)}`,
      email: `client${i + 1}@example.com`,
      phone: 600000000 + Math.floor(Math.random() * 399999999),
      specific_price: `${Math.floor(Math.random() * 10) + 1}%`,
      payement_requirement: ["30 Days", "15 Days", "Immediate"][Math.floor(Math.random() * 3)],
      facturation_address: `Billing Street ${Math.ceil(Math.random() * 100)}, City ${Math.ceil(Math.random() * 50)}`,
      payement_method: ["Credit Card", "Bank Transfer", "Cash"][Math.floor(Math.random() * 3)],
      notes: `Notes for Client ${i + 1}`,
    }
  ],
  articles: Array.from({ length: Math.ceil(Math.random() * 5) }, (_, j) => ({
    id: 2000 + j,
    name: `Product ${j + 1}`,
    description: `Description for Product ${j + 1}`,
    category: ["Electronics", "Furniture", "Clothing", "Food"][Math.floor(Math.random() * 4)],
    price: Math.floor(Math.random() * (500 - 50) + 50),
    quantity: Math.ceil(Math.random() * 50),
    weight: Math.random() * (10 - 1) + 1,
    brand: `Brand ${j + 1}`,
    added_date: new Date(),
    minimum_stock: Math.floor(Math.random() * 20) + 1,
    supplier: [
      {
        id: Math.ceil(Math.random() * 10),
        name: `Supplier ${Math.ceil(Math.random() * 10)}`,
        type: "Wholesale",
        status: "Active",
        address: `Supplier Address ${Math.ceil(Math.random() * 100)}`,
        city: "City",
        postalCode: "12345",
        country: "Country",
        phone: "123-456-7890",
        email: `supplier${Math.ceil(Math.random() * 10)}@example.com`,
        website: `www.supplier${Math.ceil(Math.random() * 10)}.com`,
        preferredPaymentMethod: "Bank Transfer",
        productsSupplied: [
          {
            name: `Product ${j + 1}`,
            price: Math.floor(Math.random() * (500 - 50) + 50),
          },
        ],
        addedAt: new Date(),
      }
    ],  // supplier comme un tableau d'objets Supplier
  })),
})).map(invoice => {
  invoice.TTC = invoice.HT + (invoice.HT * invoice.TVA / 100);
  return invoice;
});
